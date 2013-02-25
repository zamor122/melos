class Video < YouVersion::Resource

  attribute :id
  attribute :type
  attribute :title
  attribute :description
  attribute :runtime
  attribute :credits
  attribute :created_dt
  attribute :published_dt
  attribute :references
  attribute :language_tag
  attribute :short_url

  def small_image
    thumbnails.select {|th| th.width == 320 }.first
  end

  def hero_image
    thumbnails.select {|th| th.width == 915 }.first
  end

  def self.list_path
    "search/videos"
  end

  def self.api_path_prefix
    "videos"
  end

  def total_videos
    return 0 unless videos
    videos.count
  end

  def videos
    @videos
  end

  def renditions
    @renditions
  end

  def webm
    rendition("webm").first
  end

  def rendition(format)
    @renditions.reject {|rend| rend.format != format}
  end

  def publisher
    @publisher
  end

  def thumbnails
    @thumbnails
  end

  def series?
    return false if videos.nil?
    videos.count > 0
  end

  # Parameters:
  # query of what you're wanting to search for
  # page  number of results to return
  def self.search(query = "*", params = {})
    page   = params[:page] || 1
    params = {query: query, page: page}

    response = YvApi.get(list_path, params) do |errors|
      if errors.length == 1 && [/^No(.*)found$/, /^(.*)s not found$/, /^Search did not match any documents$/].detect { |r| r.match(errors.first["error"]) }
        return []
      else
        raise YouVersion::ResourceError.new(errors)
      end
    end

    list = ResourceList.new do |l|
      l.total = response.total
      response.videos.each do |data|
        l << Video.new(data)
      end
    end
    return list
  end


  def after_build
    @publisher  = build_publisher(attributes.publisher)
    @renditions = build_renditions(attributes.renditions)
    @videos     = build_subvideos(attributes.sub_videos)
    @thumbnails = build_thumbnails(attributes.thumbnails)
  end

  protected

  # Populate video thumbnails
  def build_thumbnails( images_array )
    return nil if images_array.blank?
    images = ResourceList.new do |list|
      list.total = images_array.count
      images_array.each do |img|
        list << Videos::Image.new(img)
      end
    end
    return images
  end

  # Populate publisher object
  def build_publisher( pub_atts )
    return nil if pub_atts.blank?
    return Videos::Publisher.new( pub_atts )
  end

  # Populate child videos
  def build_subvideos( videos_array )
    return nil if videos_array.blank?
    videos = ResourceList.new do |list|
      list.total = videos_array.count
      videos_array.each do |vid|
        list << Video.new(vid)
      end
    end
    return videos
  end

  # Populate video renditions
  def build_renditions( renditions_array )
    return nil if renditions_array.blank?
    renditions = ResourceList.new do |list|
      list.total = renditions_array.count
      renditions_array.each do |ren|
        list << Videos::Rendition.new(ren)
      end
    end
    return renditions
  end

end