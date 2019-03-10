import {isPlainObject} from '../utils'


export function merge(parent, child, strategies, defaultStrategy) {
  strategies = strategies || {}

  var keys = Object.keys(parent).concat(Object.keys(child)).filter((v, i, a) => a.indexOf(v) === i);
  var merged = {}

  keys.forEach(key => {
    var fn_merge = typeof strategies[key] !== 'undefined' ? strategies[key] : defaultStrategy
    if (fn_merge) {
      merged[key] = fn_merge(parent[key], child[key])
    }
  })

  return merged
}

export function mergeMultiple (list, strategies, defaultStrategy) {

  // ensure that there are at least 2 items
  if (!list.length) list.push({})
  if (list.length==1) list.push({})

  var parent = list.shift()
  list.forEach(child => {
    parent = merge(parent, child, strategies, defaultStrategy, true)
  })
  return parent
}

export function defaultMerge (parent, child) {
  if (typeof parent == 'undefined') return child
  if (typeof child == 'undefined') return parent

  if (isPlainObject(parent) && isPlainObject(child)) {
    return Object.assign({}, parent, child)
  }

  return child
}

export function functionMerge (parent, child, mergeFn) {
  if (!parent) return child
  if (!child) return parent

  // result merge fn
  mergeFn = mergeFn || defaultMerge

  return function () {
    var args = Array.prototype.slice.call(arguments)
    var pRes = parent.apply(this, args)
    var cRes = child.apply(this, args)
    return mergeFn(
      pRes,
      cRes
    )
  }
}

export function noMerge (parent, child, defaultValue) {
  if (typeof child === 'undefined') return defaultValue
  return child
}

export function mapMerge (parent, child, mergeFn) {
  if (!parent) return child
  if (!child) return parent

  // value merge fn
  mergeFn = mergeFn || defaultMerge

  var keys = Object.keys(parent).concat(Object.keys(child)).filter((v, i, a) => a.indexOf(v) === i);
  var merged = {}
  keys.forEach(k => {
    merged[k] = parent[k] === null ? null : mergeFn(parent[k], child[k])
  })
  return merged
}

export function arrayMerge (parent, child, unique) {
  if (!parent) return child
  if (!child) return parent

  var merged = parent.concat(child)

  if (unique) {
    merged = merged.filter((v, i, a) => a.indexOf(v) === i)
  }

  return merged
}

export var arrayUniqueMerge = (p, c) => arrayMerge(p, c, true)
