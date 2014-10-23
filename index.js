$(function() {

    // var board = new Board(4);
    var controller = new tabController($('.control_active'));

    // controller.domElem.on({
    //     enter: fn(),
    //     out: fn()
    // })


    $('button').on('click', function(e) {
        var wrap = $('.answer').parent();

        if(wrap.hasClass('notify')) {
            $('body').removeClass('scene');
            wrap.removeClass('notify');
        } else {
            $('body').addClass('scene');
            wrap
                .addClass('notify')
                .one('webkitTransitionEnd', function() {
                    var times = 0,
                        duration = 1,
                        timer;

                    timer = setInterval(function() {
                        setTransition(wrap, duration+=times * .13)

                        console.log(times);
                        if(++times === 5) {
                            clearTimeout(timer);
                            setTransition(wrap, 2);
                        }
                    }, 500);

                });

        }

    });

    setTransition = function(elem, val) {
        elem.css('-webkit-transition-duration', val + 's');
    }

});
