module YouVersion
  class ResourceError < StandardError
    attr_accessor :errors

    def initialize(api_errors)
      @errors = api_errors.map { |e| (e.is_a? Hash) ? e["error"] : e }
    end

    def message
      @errors.join("\n")
    end
  end

  class Resource
    extend ActiveModel::Naming
    include ActiveModel::Conversion
    include ActiveModel::Validations

    class <<self
      # This allows child class to easily override the prefix
      # of its API path, if it happens not to be name.tableize.
      def api_path_prefix
        name.tableize
      end

      def list_path
        "#{api_path_prefix}/items"
      end

      def resource_path
        "#{api_path_prefix}/view"
      end

      def update_path
        "#{api_path_prefix}/update"
      end

      def create_path
        "#{api_path_prefix}/create"
      end

      def delete_path
        "#{api_path_prefix}/delete"
      end

      def retry_with_auth?(errors)
        errors.find {|t| t['key'] =~ /username_and_password.required/}
      end

      def find(id, params = {}, &block)
        api_errors = nil

        auth = params.delete(:auth)

        opts = {id: id}
        opts.merge! params  # Let params override if it already has an :id
        # First try request as an anonymous request
        response = get(resource_path, opts) do |errors|
          if retry_with_auth?(errors)
            # If API said it wants authorization, try again with auth
            get(resource_path, opts.merge(auth: auth)) do |errors|
              # Capture errors
              api_errors = errors
            end
          else
            Rails.logger.info "** Resource.find: got non-auth error: #{errors}"
            # Some other error, just capture and the error we got
            api_errors = errors
          end

          # Down here we do something with the real error
          if api_errors
            if block_given?
              response = block.call(api_errors)
              # all the weird crap they do now
            end
            raise ResourceError.new(api_errors)
          end
        end

        new(response.merge(:auth => params[:auth]))
      end

      def all(params = {})
        response = YvApi.get(list_path, params) do |errors|
          raise ResourceError.new(errors)
        end
        puts "*"*80
        pp response
        puts "*"*80
        # TODO: Switch to ResourceList here
        response.send(api_path_prefix).map {|data| new(data.merge(:auth => params[:auth]))}
      end

      # Resource list, but just return whatever the API gives us.
      # TODO: As soon as we've finished migrating all the resources,
      # check to see that both all() and all_raw() are really needed.
      # Likely they can be combined or one of them can be eliminated.
      def all_raw(params = {}, &block)
        response = YvApi.get(list_path, params) do |errors|
          if block_given?
            block.call(errors)
          else
            raise ResourceError.new(errors)
          end
        end
      end

      def create(data, &block)
        new(data).save(&block)
      end

      def destroy(id, auth = nil, &block)
        post(delete_path, {:ids => id, :auth => auth}, &block)
      end

      attr_accessor :resource_attributes

      def attribute(attr_name, serialization_class = nil)
        @resource_attributes ||= []
        @resource_attributes << attr_name

        define_method(attr_name) do
          if serialization_class
            serialization_class.new attributes[attr_name]
          else
            attributes[attr_name]
          end
        end

        define_method("#{attr_name}=") do |val|
          if serialization_class
            attributes[attr_name] = (val.respond_to?(:to_attribute) ? val.to_attribute : val.to_s)
          else
            attributes[attr_name] = val
          end
        end
      end

      def secure(*secure_method_names)
        @secure_methods ||= []
        @secure_methods += secure_method_names.map(:to_sym)
      end

      def secure_caller?(caller)
        # TODO: Is this slow?  Nasty?  Probably. :(
        calling_method = caller.first.match(/`(.*)'$/)[1]
        @secure_methods.present? && @secure_methods.include?(calling_method.to_sym)
      end

      # If the calling method is one of those for which
      # we need to use https, add :secure => true to params
      def securify(params, caller)
        params.merge!(:secure => true) if secure_caller?(caller)
        params
      end

      def post(path, params, &block)
        YvApi.post(path, securify(params, caller), &block)
      end

      def get(path, params, &block)
        YvApi.get(path, securify(params, caller), &block)
      end
    end

    attr_accessor :attributes

    attribute :id
    attribute :auth

    def after_build; end

    def initialize(data = {})
      @attributes = data
      after_build
    end

    def persisted?
      return !id.blank?
    end

    def to_param
      id
    end

    def before_save; end;
    def after_save(response); end;
    def save
      response = true

      return false unless authorized?

      before_save

      begin
        return false unless valid?

        token = Digest::MD5.hexdigest "#{self.auth.username}.Yv6-#{self.auth.password}"

        response = self.class.post(self.class.create_path, attributes.merge(:token => token, :auth => self.auth)) do |errors|
          new_errors = errors.map { |e| e["error"] }
          self.errors[:base] << new_errors

          if block_given?
            yield errors
          end
          
          response = false
        end

        self.id = response.try(:id)
      ensure
        after_save(response)
      end

      response
    end

    def before_update; before_save; end;
    def after_update(response); after_save(response); end;
    def update(updated_attributes)
      self.attributes = self.attributes.merge(updated_attributes)
      response = true

      return false unless authorized?

      before_update

      begin
        return false unless valid?

        token = Digest::MD5.hexdigest "#{self.auth.username}.Yv6-#{self.auth.password}"

        response = self.class.post(self.class.update_path, attributes.merge(:token => token, :auth => self.auth)) do |errors|          
          new_errors = errors.map { |e| e["error"] }
          self.errors[:base] << new_errors

          if block_given?
            yield errors
          end
          
          response = false
        end
      ensure
        after_update(response)
      end

      response
    end

    def before_destroy; end;
    def after_destroy; end;
    def destroy
      response = true

      return false unless authorized?

      before_destroy

      begin
        response = self.class.destroy(self.id, self.auth) do |errors|
          new_errors = errors.map { |e| e["error"] }
          self.errors[:base] << new_errors

          if block_given?
            yield errors
          end

          response = false
        end
      ensure
        after_destroy
      end
      response
    end

    def authorized?
      unless self.auth
        self.errors.add(:base, "auth is required, but it's not set.")
      else
        true
      end
    end
  end
end
