require('intersection-observer');


function getHiddenProp(){
    var prefixes = ['webkit','moz','ms','o'];

    // if 'hidden' is natively supported just return it
    if ('hidden' in document) return 'hidden';

    // otherwise loop over all the known prefixes until we find one
    for (var i = 0; i < prefixes.length; i++){
        if ((prefixes[i] + 'Hidden') in document)
            return prefixes[i] + 'Hidden';
    }

    // otherwise it's not supported
    return null;
}

function isHidden() {
    var prop = getHiddenProp();
    if (!prop) return false;

    return document[prop];
}


function VisibilityObserver(callback, element, options) {

    var _optWaitHidden = options && options.waitHidden || 0
    var _optWaitShown = options && options.waitShown || 0

    var _visible = null; // null means unknown

    var _timer = null;

    function __setVisibility (visible, reason) {
        if (visible!==_visible) {
            _visible = visible
            callback(_visible, reason)
        }
    }

    function _setVisibility (visible, reason) {

      var delay = visible ? _optWaitShown : _optWaitHidden

      if (_timer !== null) {
        clearTimeout(_timer)
        _timer = null
      }

      if (delay) {

        _timer = setTimeout(function () {
          _timer = null
          __setVisibility(visible, reason)
        }, delay)

      } else {

        __setVisibility(visible, reason)

      }

    }

    // Intersection Observer

    var _ioCallback = function (entries, _observer) {
        if (entries.length > 0) {
            _setVisibility(entries[0].isIntersecting, 'element')
        }
    }

    var ioObserver = new IntersectionObserver(_ioCallback)
    ioObserver.observe(element)


    // Page Visibility

    var _visCallback = function () {
        _setVisibility(!isHidden(), 'page')
    }

    var _visProp = getHiddenProp(), _visEvtName = null;
    if (_visProp) {
        _visEvtName = _visProp.replace(/[H|h]idden/,'') + 'visibilitychange';
        document.addEventListener(_visEvtName, _visCallback, false);
    }

    this.isVisible = function () {
        return _visible
    }

    this.destroy = function () {
        ioObserver.disconnect()
        if (_visEvtName) {
            document.removeEventListener(_visEvtName, _visCallback, false);
        }
        if (_timer !== null) {
          clearTimeout(_timer)
          _timer = null
        }
    }



}


/*
var element = document.getElementById('elem');

var callback = function (visible, reason) {
	console.log('visible=', visible, reason)
}

var observer = new VisibilityObserver(callback, element, {
	'waitHidden': 2000
});
*/

export default VisibilityObserver
