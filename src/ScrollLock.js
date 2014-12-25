/**
 * Created by laiff on 10.12.14.
 */

/**
 * Prevent default behavior for event
 *
 * @param e
 * @returns {boolean}
 */
var cancelScrollEvent = function (e) {
    e.stopImmediatePropagation();
    e.preventDefault();
    e.returnValue = false;
    return false;
};

var addScrollEventListener = function (elem, handler) {
    elem.addEventListener('wheel', handler, false);
};

var removeScrollEventListener = function (elem, handler) {
    elem.removeEventListener('wheel', handler, false);
};

var addTouchStartEventListener = function(elem, handler) {
    elem.addEventListener('touchstart', handler, false);
};

var removeTouchStartEventListener = function(elem, handler) {
    elem.removeEventListener('touchstart', handler, false);
};

var addTouchMoveEventListener = function(elem, handler) {
    elem.addEventListener('touchmove', handler, false);
};

var removeTouchMoveEventListener = function(elem, handler) {
    elem.removeEventListener('touchmove', handler, false);
};


var previousTouchEvent = null;

var deltaTouch = function(touchEvent, st) {
    if (previousTouchEvent) {
        var delta = -(touchEvent.touches[0].screenY - previousTouchEvent.touches[0].screenY);
        previousTouchEvent = touchEvent;
        return delta;
    }
    previousTouchEvent = touchEvent;
    return 0;
};


/**
 * @extends ReactCompositeComponentInterface
 *
 * @mixin ScrollLock
 */
var ScrollLock = {

    componentDidMount: function () {
        this.scrollLock();
        this.touchLock();
    },

    componentDidUpdate: function () {
        this.scrollLock();
        this.touchLock();
    },

    componentWillUnmount: function () {
        this.scrollRelease();
        this.touchRelease();
    },

    scrollLock: function () {
        var elem = this.getDOMNode();
        if (elem) {
            addScrollEventListener(elem, this.onScrollHandler);
        }
    },

    scrollRelease: function () {
        var elem = this.getDOMNode();
        if (elem) {
            removeScrollEventListener(elem, this.onScrollHandler);
        }
    },

    touchLock: function () {
        var elem = this.getDOMNode();
        if (elem) {
            addTouchMoveEventListener(elem, this.onTouchHandler);
            addTouchStartEventListener(elem, this.onTouchStartHandler);
        }
    },

    touchRelease: function () {
        var elem = this.getDOMNode();
        if (elem) {
            removeTouchMoveEventListener(elem, this.onTouchHandler);
            removeTouchStartEventListener(elem, this.onTouchStartHandler);
        }
    },

    onScrollHandler: function (e) {
        var elem = this.getDOMNode();
        var scrollTop = elem.scrollTop;
        var scrollHeight = elem.scrollHeight;
        var height = elem.clientHeight;
        var wheelDelta = e.deltaY;
        var isDeltaPositive = wheelDelta > 0;

        if (isDeltaPositive && wheelDelta > scrollHeight - height - scrollTop) {
            elem.scrollTop = scrollHeight;
            return cancelScrollEvent(e);
        }
        else if (!isDeltaPositive && -wheelDelta > scrollTop) {
            elem.scrollTop = 0;
            return cancelScrollEvent(e);
        }
    },

    onTouchStartHandler: function(e) {
        deltaTouch(e, this.getDOMNode().scrollTop);
    },

    onTouchHandler: function(e) {
        var elem = this.getDOMNode();
        var scrollTop = elem.scrollTop;
        var scrollHeight = elem.scrollHeight;
        var height = elem.clientHeight;
        var wheelDelta = deltaTouch(e, elem.scrollTop);
        var isDeltaPositive = wheelDelta > 0;

        if (isDeltaPositive && wheelDelta >= scrollHeight - height - scrollTop) {
            elem.scrollTop = scrollTop;
            return cancelScrollEvent(e);
        }
        else if (!isDeltaPositive && -wheelDelta >= scrollTop) {
            elem.scrollTop = 0;
            return cancelScrollEvent(e);
        }
    }
};

module.exports = ScrollLock;
