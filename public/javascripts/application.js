// Module pattern + Closure
var YV = (function($, window, document, undefined) {
  // Private constants.
  var HTML = $(document.documentElement);
  var KEY_ESC = 27;
  var TOP_OFFSET = 82;

  // Internet Explorer detection.
  var BROWSER = $.browser;
  var VERSION = parseInt(BROWSER.version, 10);
  var IE = BROWSER.msie;
  var IE7 = !!(IE && VERSION === 7);
  var IE8 = !!(IE && VERSION === 8);
  var IE9 = !!(IE && VERSION === 9);

  // Expose YV methods.
  return {
    // Run everything in YV.init
    go: function() {
      for (var i in YV.init) {
        YV.init[i]();
      }
    },
    misc: {
      kill_widget_spacers: function() {
        // Kill spacers, if they exist already
        // because this function is called when
        // exiting "full screen" mode, so make
        // them up anew, to clean the slate.
        $('.widget_spacer').remove();
      }
    },
    // YV.init
    init: {
      // YV.init.last_child
      last_child: function() {
        if (IE7 || IE8) {
          $('li, tr, td, th, dd, span, tbody').filter(':last-child').addClass('last-child');
        }
      },
      // YV.init.modal_window
      modal_window: function() {
        var modal = $('#modal_window');

        if (!modal.length) {
          return;
        }

        var overlay = $('#modal_overlay');
        var close = modal.find('.close');
        var hash = window.location.hash;

        function show_modal() {
          overlay.show();
          modal.show();

          var top = Math.round(modal.outerHeight() / 2);
          var left = Math.round(modal.outerWidth() / 2);

          modal.css({
            marginTop: -top,
            marginLeft: -left
          });
        }

        function hide_modal() {
          overlay.hide();
          modal.hide();
        }

        overlay.click(function() {
          hide_modal();
        });

        close.mousedown(function() {
          hide_modal();
          return false;
        });

        if (hash.match('#verse_')) {
          show_modal();
        }

        $(document).keydown(function(ev) {
          if (ev.keyCode === KEY_ESC) {
            hide_modal();
          }
        });
      },
      // YV.init.read_parallel
      read_parallel: function() {
        var button = $('#button_read_parallel');

        if (!button.length) {
          return;
        }

        button.click(function() {
          if (HTML.hasClass('parallel_mode')) {
            HTML.removeClass('parallel_mode').removeClass('full_screen');
            YV.misc.kill_widget_spacers();
            YV.init.fixed_widget_header();
            YV.init.fixed_widget_last();
          }
          else {
            HTML.addClass('parallel_mode').addClass('full_screen');
          }

          this.blur();
          return false;
        });
      },
      // YV.init.full_screen
      full_screen: function() {
        var button = $('#button_full_screen');

        if (!button.length) {
          return;
        }

        if (IE7 || IE8 || IE9) {
          $('#main article > div *:last-child').addClass('ie_last_child');
        }

        button.click(function() {
          if (HTML.hasClass('full_screen')) {
            HTML.removeClass('full_screen');
            YV.misc.kill_widget_spacers();
            YV.init.fixed_widget_header();
            YV.init.fixed_widget_last();
          }
          else {
            HTML.addClass('full_screen');
          }

          this.blur();
          return false;
        });
      },
      // YV.init.table_cellspacing
      table_cellspacing: function() {
        var table = $('table');

        if (!IE7 || !table.length) {
          return;
        }

        table.attr('cellspacing', '0');
      },
      // YV.init_progress_bars
      progress_bar: function() {
        var progress_bar = $('.progress_bar');

        if (!progress_bar.length) {
          return;
        }

        var speed = 1500;

        progress_bar.each(function() {
          var el = $(this);
          var width = el[0].style.width;
          var raw_width = parseInt(width, 10);
          var arrow = el.closest('.progress_wrap').find('.progress_percent_complete');

          el.css({
            width: '14px',
            visibility: 'visible'
          });

          $(window).load(function() {
            if (raw_width > 4) {
              el.delay(250).animate({
                width: width
              }, speed, function() {
                arrow.css({
                  visibility: 'visible'
                });
              });
            }
            else {
              arrow.css({
                left: '14px',
                visibility: 'visible'
              });
            }
          });
        });
      },
      // YV.init.radio_checkbox
      radio_checkbox: function() {
        var input = $('input[type="radio"], input[type="checkbox"]');

        if (IE7 || !input.length) {
          return;
        }

        function determine_checked() {
          input.each(function() {
            var el = $(this);

            if (this.checked) {
              el.closest('label').addClass('is_checked');
            }
            else {
              el.closest('label').removeClass('is_checked');
            }

            if (this.disabled) {
              el.closest('label').addClass('is_disabled');
            }
            else {
              el.closest('label').removeClass('is_disabled');
            }
          });
        }

        input.each(function() {
          var el = $(this);
          var label_class = 'faux_' + el.attr('type');

          if (el.closest('.' + label_class).length) {
            el.unwrap();
          }

          el.wrap('<label class="' + label_class + '" for="' + el.attr('id') + '"></label>');
        }).off('click.faux_input').on('click.faux_input', function() {
          determine_checked();
        }).off('focus.faux_input').on('focus.faux_input', function() {
          $(this).closest('label').addClass('is_focused');
        }).off('blur.faux_input').on('blur.faux_input', function() {
          $(this).closest('label').removeClass('is_focused');
        });

        // Run for first time.
        determine_checked();
      },
      // YV.init.accordion
      accordion: function() {
        var accordion = $('.accordion');

        if (!accordion.length) {
          return;
        }

        accordion.find('dt').click(function() {
          var dt = $(this);
          var dd = dt.next('dd');

          if (dd.is(':hidden')) {
            dd.slideDown().siblings('dd').slideUp();
          }

          this.blur();
          return false;
        });
      },
      // YV.init.dynamic_menus
      dynamic_menus: function() {
        var trigger = $('.dynamic_menu_trigger');

        if (!trigger.length) {
          return;
        }

        var all_items = trigger.parent('li');
        var all_menus = $('.dynamic_menu');
        var li_class = 'li_active';

        function hide_all_menus() {
          all_items.removeClass(li_class);
          all_menus.hide();
        }

        trigger.click(function(ev) {
          ev.preventDefault();
          ev.stopPropagation();

          var el = $(this);
          var menu = $(el.attr('href'));
          var li = el.closest('li');
          var icon = el.find('span:first').length ? el.find('span:first') : el;
          var offset = icon.offset();
          var is_full_screen = HTML.hasClass('full_screen');
          var window_width = $(window).innerWidth();
          var offset_right = offset.left + menu.outerWidth();
          var reverse = 'dynamic_menu_reverse';
          var reverse_nudge;
          var left;

          // if (is_full_screen && menu[0].id === 'menu_bookmark') {
          if (offset_right >= window_width) {
            reverse_nudge = el.hasClass('button') ? 31 : 30;
            left = offset.left - menu.outerWidth() + reverse_nudge;
            menu.addClass(reverse);
          }
          else {
            menu.removeClass(reverse);

            if (el.attr('id') === 'verses_selected_button') {
              left = offset.left - 1;
            }
            else if (el.hasClass('button')) {
              left = offset.left - 6;
            }
            else {
              left = offset.left + parseInt(icon.css('border-left-width'), 10) - 8;
            }
          }

          if (menu.is(':hidden')) {
            hide_all_menus();

            li.addClass(li_class);

            menu.css({
              left: left
            }).show();
          }
          else {
            hide_all_menus();
          }

          el.blur();
        });

        $('#menu_book').delegate('a', 'click', function() {
          var el = $(this);
          var ol = el.closest('.dynamic_menu').find('ol:first');
          var chapters = parseInt(el.data('chapters'), 10) + 1;
          var book = el.data('book');
          var version = el.data('version');
          var li = el.closest('li');
          var list = '';

          for (var i = 1; i < chapters; i++) {
            list += '<li><a href="/bible/' + book + '.' + i + '.' + version + '">' + i + '</a></li>';
          }

          li.addClass(li_class).siblings().removeClass(li_class);
          ol.html(list);

          this.blur();
          return false;
        });

        $(document).mousedown(function(ev) {
          var el = $(ev.target);

          if (el.hasClass('close') || (!el.closest('.dynamic_menu_trigger').length && !el.closest('.dynamic_menu').length)) {
            hide_all_menus();
          }
        }).keydown(function(ev) {
          if (ev.keyCode === KEY_ESC) {
            hide_all_menus();
          }
        });

        $(window).resize(function() {
          hide_all_menus();
        });
      },
      // YV.init.fixed_widget_header
      fixed_widget_header: function() {
        var header = $('.widget header');

        if (!header.length) {
          return;
        }

        // Used later.
        var timer;

        // Last sidebar widget is special, leave it alone.
        var last_widget = $('#sidebar').find('.widget:last');

        // Insert spacers.
        header.each(function() {
          var el = $(this);
          var this_widget = el.closest('.widget');

          if (this_widget[0] === last_widget[0]) {
            return;
          }

          $('<div class="widget_spacer">&nbsp;</div>').insertBefore(el);
        });

        function position_widgets() {
          // For IE. Really belongs in the window event listener,
          // but having it cleared here doesn't hurt anything.
          clearTimeout(timer);

          header.each(function() {
            var el = $(this);
            var this_widget = el.closest('.widget');

            if (this_widget[0] === last_widget[0]) {
              // Don't do anything, we'll treat this differently
              // if it's within the very last sidebar widget.
              return;
            }

            var next_widget = this_widget.next('.widget');
            var window_top = $(window).scrollTop() + TOP_OFFSET;
            var spacer = el.siblings('.widget_spacer:first');
            var spacer_top = spacer.offset().top;

            if (window_top >= spacer_top) {
              el.addClass('widget_header_fixed');

              spacer.css({
                height: 34
              });
            }
            else {
              el.removeClass('widget_header_fixed');

              spacer.css({
                height: 0
              });
            }

            if (next_widget.length) {
              if (window_top >= next_widget.offset().top) {
                el.hide();
              }
              else {
                el.show();
              }
            }
          });
        }

        // Initial call.
        position_widgets();

        // Kill off event listeners, re-create them.
        $(window).off('.widget_header').on('scroll.widget_header resize.widget_header load.widget_header', function() {
          // Irrelevant, if in "full screen" mode.
          if (HTML.hasClass('full_screen')) {
            return;
          }

          clearTimeout(timer);

          // Super-low timer, just so that we don't get caught
          // in a repetetive loop due to window scroll firing.
          timer = setTimeout(position_widgets, 1);
        });
      },
      // YV.init.fixed_widget_last
      fixed_widget_last: function() {
        var el = $('#sidebar > .widget:last-child');

        if (!el.length) {
          return;
        }

        var timer;
        var spacer = $('<div class="widget_spacer">&nbsp;</div>').insertBefore(el);

        function pin_widget() {
          // For IE. Really belongs in the window event listener,
          // but having it cleared here doesn't hurt anything.
          clearTimeout(timer);

          var spacer = el.prev('.widget_spacer');
          var spacer_top = spacer.offset().top;
          var window_top = $(window).scrollTop() + TOP_OFFSET;

          if (window_top >= spacer_top) {
            el.addClass('widget_last_fixed');
          }
          else {
            el.removeClass('widget_last_fixed');
          }
        }

        // Initial call.
        pin_widget();

        $(window).off('.widget_last').on('scroll.widget_last resize.widget_last load.widget_last', function() {
          if (HTML.hasClass('full_screen')) {
            return;
          }

          clearTimeout(timer);

          // Super-low timer, just so that we don't get caught
          // in a repetetive loop due to window scroll firing.
          timer = setTimeout(pin_widget, 1);
        });
      },
      // YV.init.verse_sharing
      verse_sharing: function() {
        var verse = $('.verse');

        if (!verse.length) {
          return;
        }

        var clear_verses = $('#clear_selected_verses');
        var li = $('#li_selected_verses');
        var button = $('#verses_selected_button');
        var count = $('#verses_selected_count');
        var input = $('.verses_selected_input');
        var article = $('#main article:first');
        var book = article.attr('data-book');
        var chapter = article.attr('data-chapter');
        var version = article.attr('data-version');
        var flag = 'selected';
        var hide = 'hide';

        function parse_verses() {
          var total = $('#version_primary .verse.' + flag).length;

          // Zero out value.
          input.val('');

          verse.each(function() {
            var el = $(this);
            var this_id = book + '.' + chapter + '.' + el.find('strong:first').html() + '.' + version;

            if (el.hasClass(flag)) {
              if ($.trim(input.val()).length) {
                // Add to hidden input.
                input.val(input.val() + ',' + this_id);
              }
              else {
                input.val(this_id);
              }
            }
          });

          if (total > 0) {
            li.removeClass(hide);
          }
          else {
            li.addClass(hide);
          }

          count.html(total);
        }
        // Run once, automatically.
        parse_verses();

        // Watch for verse selection.
        verse.click(function() {
          var el = $(this);
          var verse_id = el.attr('class').replace('verse', '').replace('selected', '').replace(/\s+/, '');

          verse_id = $('.' + verse_id);

          if (el.hasClass(flag)) {
            verse_id.removeClass(flag);
          }
          else {
            verse_id.addClass(flag);
          }

          parse_verses();
        });

        button.click(function() {
          // form.submit();
          // return false;
        });

        clear_verses.click(function() {
          $('.verse.selected').removeClass('selected');
          parse_verses();
          this.blur();
          return false;
        });
      },
      // YV.init.profile_menu
      profile_menu: function() {
        var trigger = $('#header_profile_trigger');

        if (!trigger.length) {
          return;
        }

        var li = trigger.closest('li');
        var li_class = 'li_active';

        function hide_profile_menu() {
          li.removeClass(li_class);
        }

        function show_profile_menu() {
          li.addClass(li_class);
        }

        trigger.click(function() {
          if (li.hasClass(li_class)) {
            hide_profile_menu();
          }
          else {
            show_profile_menu();
          }

          this.blur();
          return false;
        });

        $(document).mousedown(function(ev) {
          if (!$(ev.target).closest('#header_profile_menu, #header_profile_trigger').length) {
            hide_profile_menu();
          }
        }).keydown(function(ev) {
          if (ev.keyCode === KEY_ESC) {
            hide_profile_menu();
          }
        });

        $(window).resize(function() {
          hide_profile_menu();
        });
      },
      // YV.init.user_settings
      user_settings: function() {
        var radio = $('.radio_user_setting');
        var article = $('#main article');

        if (!radio.length) {
          return;
        }
        
        radio.click(function() {
          var el = $(this);
          var font = el.attr('data-setting-font');
          var size = el.attr('data-setting-size');

          font && article.attr('data-setting-font', font);
          size && article.attr('data-setting-size', size);
        });
      },
      // YV.init.highlightsmenu
      // This code up to line 651 is totally bobo. Eventually it kind of just breaks down. #needtofix 
      highlight: function() {
        var color = $('.color');
         color.toggle( 
      function(){
        color.empty('span'),
        $(this).append("<span class='selected'></span>")
      },
      function() {
        color.empty('span');
      })
      $(".remove_color").click(function(){
        color.empty('span');
      })
      },
      audio_player: function() {
        var audio = $('#audio_player');

        if (!audio.length) {
          return;
        }

        var audio_menu = $('#menu_audio_player').show();

        audio.mediaelementplayer({
          audioWidth: '100%'
        });

        audio_menu.hide();
      },
    }
  };

})(this.jQuery, this, this.document);

// Fire it off!
window.jQuery(document).ready(function() {
  YV.go();
});
