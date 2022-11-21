import jQuery from 'jquery'
(function ($) {

    $.fn.vcHilite = function (options) {
        //if (!$(this).length) { return $(this); }
        var $me = $(this);

        var engine = $.extend({
            color: $me.data('color') || 'rgba(66, 133, 244, 0.8)',
            content: $me.data('content') || $me.attr('title'),
            placement: $me.data('placement') || 'right',
            sizeController: $me.data('size') || 'width',
            excludePadding: $me.data('nopadding') || false,
            href: $me.data('href') || $me.attr('href'),
            increase: $.isNumeric($me.data('increase')) ? $me.data('increase') : 10, //increase size by default 10%
            dimensions: null,
            init: function (el) {
                var $n = $(el);

                var rect = { left: $(window).width(), top: $(window).height(), width: 0, height: 0, right: 0, bottom: 0 };
                rect.left = Math.min(rect.left, $n.offset().left);
                rect.top = Math.min(rect.top, $n.offset().top);

                rect.right = Math.max(rect.right, ($n.offset().left + $n.outerWidth()));
                rect.bottom = Math.max(rect.bottom, ($n.offset().top + $n.outerHeight()));

                rect.width = rect.right - rect.left;
                rect.height = rect.bottom - rect.top;

                var size = this.sizeController == 'width' ? rect.width : rect.height;
                var sizeInc = size * (this.increase / 100);
                this.dimension = {
                    top: (size > rect.height ? rect.top - (rect.width / 2) + (rect.height / 2) : rect.top) - (sizeInc / 2),
                    left: (size > rect.width ? rect.left - size / 2 : rect.left) - (sizeInc / 2),
                    width: size + sizeInc,
                    height: size + sizeInc,
                }

                if (this.href) {
                    $.get(this.href, function (data) {
                        this.show(this.href.indexOf(' ') > -1 ? $(data).wrap($('<div/>')).parent().find(this.href.substr(this.href.indexOf(' ') + 1))[0] : data)
                    });
                } else if (this.content) {
                    this.show(this.content)
                } else {
                    this.hide();
                }

                $(this).triggerHandler('init.hilite.cvh');
                return this;
            },
            hide: function () {

                var me = this;

                //Remove old popoverstour elements
                $('.popover').popover('destroy');
                $('.tour-overlay').remove();
                $(document).removeData('hilite.cvh');

                $me.triggerHandler('hide.hilite.cvh');
            },
            show: function (content) {
                //console.log(1);
                //this.hide();

                //Append tour focus
                $('<div class="tour-overlay"/>')
                    .css({
                        '-moz-box-shadow': '0px 0px 0px 500px ' + this.color,
                        '-webkit-box-shadow': '0px 0px 0px 500px ' + this.color,
                        'box-shadow': '0px 0px 0px 500px ' + this.color,
                        '-webkit-appearance': 'none',
                        'border-radius': '50%',
                        'z-index': 1001,
                        'position': 'fixed',
                        //'pointer-events': 'none',
                        'top': this.dimension.top + 'px',
                        'left': this.dimension.left + 'px',
                        'width': this.dimension.width + 'px',
                        'height': this.dimension.height + 'px'
                    })
                    .appendTo('body')
                    .popover({
                        content: content,
                        html: true,
                        trigger: 'manual',
                        placement: this.placement,
                        container: '.tour-overlay',
                        title: function () { return ''; }
                    })
                    .popover('show')
                    .on('mousedown', function (e) {

                        $(this).hide();
                        var BottomElement = document.elementFromPoint(e.clientX, e.clientY);
                        $(this).show();
                        //console.log(BottomElement);
                        $(BottomElement).mousedown(); //Manually fire the event for desired underlying element
                        //$(document).data('hilite.cvh').hide();
                        return false;

                    });
                //.click(function () { $(document).data('hilite.cvh').hide(); });

                //$me.triggerHandler('show.hilite.cvh');
            }
        }, options);

        //console.log(1, $(document).data('hilite.cvh'));
        $(document)
            .removeData('hilite.cvh')
            .data('hilite.cvh', engine.init(this));

        return $me;
    };

    $(document).on('click', '[data-dismiss]', function (e) {
        if ($(this).data('dismiss') === 'hilite') {
            if ($(document).data('hilite.cvh')) {
                $(document).data('hilite.cvh').hide();
            }
        }
    });

    $(document).on('click', '[data-hilite]', function (e) {
        var $me = $(this);
        var $target = $($me.data('hilite'));
        if ($target.length) {
            $target.vcHilite({
                color: $me.data('color'),
                content: $me.data('content') || $me.attr('title'),
                placement: $me.data('placement'),
                sizeController: $me.data('size'),
                excludePadding: $me.data('nopadding'),
                href: $me.data('href') || $me.attr('href'),
                increase: $.isNumeric($me.data('increase')) ? $me.data('increase') : null, //increase size by default 10%
            });
        }
        return false;

        //var popover = $('#example').data('bs.popover');
        //popover.options.content = "YOUR NEW TEXT";
    });
})(jQuery);