import { extend } from 'quasar'


function mergeFnStrategy(parent, child, vm) {
  if (!child) {
    return parent
  }
  if (!parent) {
    return child
  }

  return function () {
    var args = arguments
    var _parent = typeof parent === 'function' ? parent.apply(this, args) : parent
    var _child = typeof child === 'function' ? child.apply(this, args) : child
    return extend(true, {}, _parent || {}, _child || {})
  }
}

export default ({EThingUI, Vue}) => {

  var strategies = Vue.config.optionMergeStrategies

  strategies.layout = mergeFnStrategy
  strategies.schema = mergeFnStrategy

  // access helpers
  Vue.prototype.$layout = function (vm) {
    if (!vm) {
      vm = this
    }
    if (!(vm instanceof Vue)) {
      vm = Vue.extend(vm)
    }
    return vm.options.layout ? vm.options.layout.call(vm) : {}
  }

  Vue.prototype.$schema = function () {
    var args = Array.prototype.slice.call(arguments)
    var vm = args.shift()

    if (!(vm instanceof Vue)) {
      vm = Vue.extend(vm)
    }
    return vm.options.schema ? vm.options.schema.apply(vm, args) : {}
  }

}
