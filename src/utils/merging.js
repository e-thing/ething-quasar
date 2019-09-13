import { extend } from 'quasar'
import {isPlainObject, isDefined, isEmptyObject, isVueComponent} from '.'


export function merge(parent, child, strategies, defaultStrategy, ctx) {
  strategies = strategies || {}

  var keys = Object.keys(parent).concat(Object.keys(child)).filter((v, i, a) => a.indexOf(v) === i);

  keys.forEach(key => {
    var fn_merge = typeof strategies[key] !== 'undefined' ? strategies[key] : defaultStrategy
    if (fn_merge) {
      parent[key] = fn_merge(parent[key], child[key], ctx)
    }
  })

  return parent
}

export function mergeMultiple (list, strategies, defaultStrategy, ctx) {

  // ensure that there are at least 2 items
  if (!list.length) list.push({})
  if (list.length==1) list.push({})

  var parent = list.shift()
  list.forEach(child => {
    parent = merge(parent, child, strategies, defaultStrategy, ctx)
  })
  return parent
}

export function defaultMerge (parent, child) {
  if (typeof parent == 'undefined') return child
  if (typeof child == 'undefined') return parent

  if (isPlainObject(parent) && isPlainObject(child)) {
    return extend(true, {}, parent, child) // deep extend
    //return Object.assign({}, parent, child)
  }

  return child
}

export function functionMerge (parent, child, ctx, mergeFn) {
  if (typeof child !== 'function') {
    let _child = child
    child = function () {
      return _child
    }
  }
  if (typeof parent !== 'function') {
    let _parent = parent
    parent = function () {
      return _parent
    }
  }

  // result merge fn
  mergeFn = mergeFn || defaultMerge

  return function () {
    var args = Array.prototype.slice.call(arguments)
    ctx = ctx || {}
    ctx.args = args
    var pRes = typeof parent === 'function' ? parent.apply(this, args) : parent
    var cRes = typeof child === 'function' ? child.apply(this, args) : child
    return mergeFn(
      pRes,
      cRes,
      ctx
    )
  }
}

export function noMerge (parent, child, ctx, defaultValue) {
  if (typeof child === 'undefined') return defaultValue
  return child
}

export function mapMerge (parent, child, ctx, mergeFn) {
  if (!parent) parent = {}
  if (!child) child = {}

  // value merge fn
  mergeFn = mergeFn || defaultMerge

  var keys = Object.keys(parent).concat(Object.keys(child)).filter((v, i, a) => a.indexOf(v) === i);
  var merged = {}
  keys.forEach(k => {
    merged[k] = mergeFn(parent[k], child[k], ctx)
  })
  return merged
}

export function arrayMerge (parent, child, ctx, unique) {
  if (!parent) return child
  if (!child) return parent

  var merged = parent.concat(child)

  if (unique) {
    merged = merged.filter((v, i, a) => a.indexOf(v) === i)
  }

  return merged
}

export var arrayUniqueMerge = (p, c, e) => arrayMerge(p, c, e, true)


export function vueComponentMerge (parent, child, ctx) {
  if (!parent) return child
  if (!child || isEmptyObject(child)) return parent

  if (isVueComponent(child)) {
    return child
  }

  // vue component extends
  var merged = extend(true, {}, child)
  merged.mixins = [parent]

  return merged
}
