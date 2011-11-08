class LikesListWidgetCell < Cell::Rails
  helper ApplicationHelper

  def display(opts = {})
    @likes = opts[:likes]
    @total = opts[:likes].count if opts[:likes]
    @title = opts[:title] ||= "Likes"
    @link = opts[:link] ||= likes_path(opts[:user_id])
    render
  end

end
