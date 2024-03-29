import { date, format, colors, openURL } from 'quasar'
import EThing from 'ething-js'
import FileSaver from 'file-saver'
import VisibilityObserver from './VisibilityObserver'
import {createModal} from './modal'
import {injectScript} from './script'
import {parse} from './templater'

export {VisibilityObserver}
export {createModal}
export {injectScript}
export {parse}
export let formatDate = date.formatDate
export {openURL, date, format, colors}

export function generateId(length) {
  length = length || 5
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}


export function sanitizeHTML (str) {
	var temp = document.createElement('div')
	temp.textContent = str
	return temp.innerHTML
}


/**
 * Get the raw type string of a value e.g. [object Object]
 */
const _toString = Object.prototype.toString

export function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}

export function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}

export function extend(out) {
  out = out || {};

  for (var i = 1, len = arguments.length; i < len; ++i) {
    var obj = arguments[i];

    if (!obj) {
      continue;
    }

    for (var key in obj) {
      if (!obj.hasOwnProperty(key)) {
        continue;
      }

      if (isPlainObject(obj[key])) {
        out[key] = extend(out[key], obj[key]);
        continue;
      }

      out[key] = obj[key];
    }
  }

  return out;
}

export function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}


export function dateToString (d, def) {
  if (typeof d === 'string' || typeof d === 'number') d = new Date(d)
  if (!d) {
    return typeof def === 'undefined' ? '-' : def
  }
  var ts = d.getTime()
  return date.formatDate(ts, 'YYYY-MM-DD HH:mm:ss')
}

export function sizeToString (s) {
  return format.humanStorageSize(s)
}

export function colorNameToHex (colorStr) {
  colorStr = colorStr || ''
  if (/^#/.test(colorStr)) return colorStr
  var qColor = colors.getBrand(colorStr)
  if (qColor) return qColor
  var a = document.createElement('div');
  a.style.color = colorStr;
  var colors_ = window.getComputedStyle( document.body.appendChild(a) ).color.match(/\d+/g).map(function(a){ return parseInt(a,10); });
  document.body.removeChild(a);
  return (colors_.length >= 3) ? '#' + (((1 << 24) + (colors_[0] << 16) + (colors_[1] << 8) + colors_[2]).toString(16).substr(1)) : colorStr;
}

/**
return a formatted string describing an object
exemple:
  { "key1": 0, "key2": "value"}
  will output
  "key1:  0, key2: value"
**/
export function describe (obj) {
  var s = []

  const toString = function (v) {
    if (EThing.utils.isId(v)) {
      const r = EThing.arbo.get(v)
      if (r) {
        return r.name()
      }
    }
    if (Array.isArray(v)) {
      return v.map( i => toString(i) ).join(' ')
    }
    if (typeof v === 'object' && v !== null) {
      if (Object.keys(v).length === 0) return ''
      /*if (typeof v.toString === 'function')
        return v.toString()*/
      return '{...}'
    }
    if (v===null) return ''
    return String(v)
  }

  for (var k in obj) {
    let v = obj[k]
    var l = toString(v)

    if (!l || typeof v === 'undefined') continue
    s.push(k + ': ' + l)
  }
  return s.join(', ')
}

export function saveAs (data, filename) {
  if (isPlainObject(data)) {
    // convert it into a String
    data = JSON.stringify(data, null, 2)
  }

  if (typeof data === 'string') {
    // convert it into a Blob
    data = new Blob([data], {
        type: 'text/plain'
    });
  }

  return FileSaver.saveAs(data, filename || 'data')
}

export function isDefined (obj) {
  return typeof obj !== 'undefined'
}

export function isEmptyObject (obj) {
  return isPlainObject(obj) && Object.keys(obj).length==0
}

export function isVueComponent (obj) {
  return isDefined(obj.mixins) ||
    isDefined(obj.extends) ||
    isDefined(obj.el) ||
    isDefined(obj.render) ||
    isDefined(obj.template) ||
    isDefined(obj.beforeCreate) ||
    isDefined(obj.beforeDestroy)
}
