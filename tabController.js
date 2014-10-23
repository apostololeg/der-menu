$(function() {

    var __view = '_view',
        __active = '_active',
        delta = {
            38: 'top',
            40: 'bottom',
            37: 'left',
            39: 'right'
        };

    /**
     * @constructor
     *
     * @param {Object} elem – начальный активный элемент
     * @param {Object} blockName – имя блока контроллера (не обязательный)
     */
    function tabController(elem, elemName) {

        this.__elem = elemName || this.__elem;
        this.domElem = $('.' + this.__elem);

        this.setItem(elem);
        this.setView();

        $(document).on('keydown', this._onKeyDown.bind(this));

    };

    $.extend(tabController.prototype, {

        __elem: 'control',

        __filter: {
            left: function(active, next) {
                return next.x <= active.left &&
                    next.y >= active.top &&
                    next.y <= active.bottom;
            },
            right: function(active, next) {
                return next.x >= active.right &&
                    next.y >= active.top &&
                    next.y <= active.bottom;
            },
            top: function(active, next) {
                return next.y <= active.top &&
                    next.x >= active.left &&
                    next.x <= active.right;
            },
            bottom: function(active, next) {
                return next.y >= active.bottom &&
                    next.x >= active.left &&
                    next.x <= active.right;
            }
        },

        __sort: function(direction, a, b) {
            switch(direction) {
                case 'left':
                    return b.left - a.left;
                break

                case 'right':
                    return a.right - b.right;
                break;

                case 'top':
                    return b.top - a.top;
                break;

                case 'bottom':
                    return a.bottom - b.bottom;
                break;
            }
        },

        _lastDirection: '',

        move: function(direction) {
            if(!direction) {
                console.log('Please, specify the direction');
                return false;
            }

            var nextItem = this._getNextElement(direction);

            // если найден элемент,
            // на который можно переместиться в заданном направлении
            if(nextItem) {
                this
                    .setItem(nextItem)
                    .domElem.trigger('move', {
                        direction: direction,
                        elem: this.item
                    });
            }
        },

        setItem: function(elem) {
            var _active = this.__elem + __active,
                newItem;

            if(typeof elem === 'object') {
                newItem = elem;
            } else {
                if(elem === 'in') {
                    var finded = this.item.children('.' + this.__elem).eq(0);
                    // проверяем, что ниже есть куда идти
                    if(finded.length) {
                        newItem = finded;
                    }
                } else {
                    // проверяем, что выше есть куда идти
                    if(this.view.parent('.' + this.__elem).length) {
                        newItem = this.view;
                    }
                }
            }

            if(newItem) {
                this.item && this.item.removeClass(_active);
                this.item = newItem.addClass(_active);
            }

            return this;
        },

        setView: function() {
            var _active = this.__elem + __view,
                finded = this.item.parent('.' + this.__elem);

            if(finded.length) {
                this.view && this.view.removeClass(_active);
                this.view = finded.addClass(_active);
            }

            return this;
        },

        _onKeyDown: function(e) {
            var key = (e || window.event).keyCode;

            switch(key) {
                // Enter
                case 13:
                    this._onEnter();
                break;
                // Backspace
                case 8:
                    this._onOut();
                    e.preventDefault();
                break;

                case 37:
                case 38:
                case 39:
                case 40:
                    this.move(delta[key]);
                break;
            }
        },

        _onEnter: function() {
            this
                .setItem('in')
                .setView()
                .domElem.trigger('enter', {
                    view: this.view,
                    elem: this.item
                });
        },

        _onOut: function() {
            this
                .setItem('out')
                .setView()
                .domElem.trigger('out', {
                    view: this.view,
                    elem: this.item
                });
        },

        _getNextElement: function(direction) {
            var activeOffset = this._getMetrics(this.item),
                filter = this.__filter[direction].bind(this, activeOffset),
                nearElems = this._getOffsets().filter(filter);

            console.log('[_getNextElement]', nearElems);

            return nearElems.length &&
                nearElems.sort(this.__sort.bind(this, direction)).shift(1).elem;
        },

        _getOffsets: function() {
            var that = this,
                selector = '.' + this.__elem + ':not(.' + this.__elem + __active + ')',
                items = this.view.children(selector),
                offsets = [];

            Array.prototype.slice.call(items).forEach(function(_elem) {
                var elem = $(_elem);

                offsets.push($.extend(
                    { elem: elem },
                    that._getMetrics(elem)
                ));
            });

            return offsets;
        },

        _getMetrics: function(elem) {
            var offset = elem.offset(),
                h = elem.height(),
                w = elem.width(),
                data = {
                    left: Math.round(offset.left),
                    right: Math.round(offset.left + w),
                    top: Math.round(offset.top),
                    bottom: Math.round(offset.top + h)
                };

            data.x = data.left + w/2;
            data.y = data.top + h/2;

            return data;
        }

    });

    window.tabController = tabController;

});
