class Version
  @@versions_api_data = nil
  @@books_api_data = {}
  @@info_api_data = {}
  @@versions = {}
  @@books = {}
  @@version_books = {}
  @@all_by_language = {}
  @@languages = {}
  def self.all(lang = "")
    if lang == ""
      versions
    else
      versions.select { |k, v| v.language.iso == lang.to_s }
    end
  end

  def self.find(version)
    raise NotAVersionError if (ver = versions[version]).nil?

    ver
  end

  def self.languages
    Hash[*Version.all.group_by { |k, v| v.language}.keys.each {|a| a.to_a}.map {|h| h.to_a.flatten - ["iso", "human"]}.flatten]
  end

  def self.all_by_language(opts={})
    all_by_language = Version.all.find_all{|k, v| opts[:only].include? k}.group_by {|k, v| v.language.iso} if opts[:only]

    all_by_language ||= Version.all.group_by {|k, v| v.language.iso}
    all_by_language.each {|k, v| all_by_language[k] = Hash[*v.flatten]}
    all_by_language
  end

  def initialize(version)
    @version = version
    @data = versions_api_data.versions[version]
  end

  def audio?
    @data.audio == "true"
  end

  def language
    @data.language
  end

  def rtl?
    @data.text_direction=="rtl"
  end

  def text_direction
    @data.text_direction
  end

  def contains?(ref)
    raise "versions contain references!" if !ref.is_a? Reference
    listing = books_list

    #return false if ref.version && ref.version != osis
    return false if ref.book && listing[ref.book.to_s].nil?
    return false if ref.chapter && listing[ref.book.to_s].chapter[ref.chapter.to_s].nil?
    return false if ref.verse && ref.verse > listing[ref.book.to_s].chapter[ref.chapter.to_s].verses
    return true
  end

  def title
    @data.title
  end

  def osis_human
    @version.upcase.match(/\A[^-_]*/)
  end

  def osis
    @version
  end

  def books
    @books ||= books_list(@version)
  end

  def to_s
    "#{@data.title} (#{osis_human})"
  end

  def to_param
    @version
  end

  def copyright
    @copyright ||= @data.copyright
  end

  def info
    info_api_data(@version).copyright
  end

  def self.default_for(lang)
    versions_api_data.defaults[lang.to_s]
  end

  def self.default()
    versions_api_data.defaults["en"]
  end

  def self.sample_for(lang, opts={})
    opts[:except] ||= ""

    samples = all_by_language[lang].find_all{|k,v| k != opts[:except]}
    sample = nil

    until !sample.nil? || samples.empty?
      sample = samples.delete_at(Random.rand(samples.length))[1]

      sample = nil if opts[:has_ref] && !sample.contains?(opts[:has_ref])
    end

    raise NotAChapterError if sample.nil?

    return sample.osis
  end

  private

  def self.books_list(version)
    hash = {}
    books_api_data(version).each do |v|
      hash[v.osis.downcase] = { human: v.human, chapters: v.chapters.to_i, chapter: {}}
      (1..v.chapters.to_i).each do |x|
         hash[v.osis.downcase][:chapter][x.to_i] = {verses: v.verses[x-1]}
      end
    end
    Hashie::Mash.new(hash)
  end

  def books_list(version = nil)
    version ||= osis
    self.class.books_list(version)
  end

  def self.books_api_data(version)
    YvApi.get("bible/books", cache_for: 12.hours, version: version, cache_for: 12.hours)
  end

  def books_api_data(version)
    self.class.books_api_data(version)
  end

  def self.versions
    versions = {}
    versions_api_data.versions.each { |k, v| versions[k] = Version.new(k) }
    versions
  end

  def versions
    self.class.versions
  end

  def self.versions_api_data
    return @versions_api_data unless @versions_api_data.nil?

    @versions_api_data = YvApi.get("bible/versions", type: "all", cache_for: 12.hours)
    @versions_api_data.defaults = Hash[@versions_api_data.defaults.map {|d| [YvApi::to_app_lang_code(d[0]), d[1]]}]
    @versions_api_data.versions.each {|k,v| v.language.iso = YvApi::to_app_lang_code(v.language.iso)}
    @versions_api_data
  end

  def versions_api_data
    self.class.versions_api_data
  end

  def self.info_api_data(version)
    YvApi.get("bible/copyright", version: version, cache_for: 12.hours)
  end

  def info_api_data(version)
    self.class.info_api_data(version)
  end

  def to_attribute
    osis
  end
end
