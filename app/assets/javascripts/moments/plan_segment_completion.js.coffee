window.Moments ?= {}

class window.Moments.PlanSegmentCompletion extends window.Moments.Base

  user: ()->
    @data.user

  constructor: (@data, @feed)->
    @template = JST["moments/plan_segment_completion"]
    @feed.ready(@)

  render: ()->
    if @template

      html = @template
        uuid:         @generateID()
        id:           @data.id
        path:         @data.path
        action_url:   @data.action_url
        avatar:       @data.avatar
        status:       @data.status
        title:        @data.title
        created_dt:   @data.time_ago
        updated_dt:   @data.updated_dt
        moment_title: @data.moment_title
        comments:     @data.comments
        likes:        @data.likes
        actions:      @data.actions
        user:
          path:       @data.user.path

      return html