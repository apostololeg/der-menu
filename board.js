$(function() {

    /**
     * @contrustor
     *
     * @param {Object} x – резмер по X
     * @param {Object} y – резмер по Y
     *  Если не задан – будет взят размер по X
     */
    function Board(x, y) {
        var domElem = $('.board');

        this.container = domElem.find('.board__wrap');
        this.inner = domElem.find('.board__inner');
        this.active = $('.control_active');
        this.controller = new keyController(this.active);

        this.size = { x:x, y:y };
        this.tileSize = {
            x: 100 / x,
            y: 100 / y
        };

        this.container.on('webkitTransitionEnd', this._onSwitched.bind(this));
        this.controller.domElem.on({
            move: this._onMove.bind(this),
            enter: this._onEnter.bind(this)
        });

        this.move(0, 0);
    };

    $.extend(Board.prototype, {

        x: 0,
        y: 0,

        _delta: {
            up:[0, 1],
            down: [0, -1],
            left: [-1, 0],
            right: [1, 0]
        },

        /**
         * Перемещение борда
         *
         * @param {Number|Object} x
         *  Number – индекс элемента по горизонтали
         *  Object – элемент, на который нужно переместиться
         * @param {Number} y – индекс элемента по вертикали
         */
        move: function(x, y) {
            var coords;

            if(typeof x === 'number' && typeof y === 'number') {
                coords = { x:x, y:y };
            } else {
                coords = x.offset();
            }

            console.log('[move]', coords);

            this.container.css(
                '-webkit-transform',
                'translate3d('+
                    -coords.x * this.tileSize.x + '%, ' +
                    coords.y * this.tileSize.y + '%, 0)'
            );
        },

        _onMove: function(e, data) {
            var delta = this._delta[data.direction];

            console.log('[_onMove]', data);

            this.active.removeClass(__.active);
            this.active = data.elem;

            // this.x += delta[0];
            // this.y += delta[1];

            this.move(data.elem);
        },


        _onSwitched: function() {
            console.log('[_onSwitched]');
            this.active.addClass(__.active);
        }

    });

    window.Board = Board;

});
