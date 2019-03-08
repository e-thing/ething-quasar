<template>
  <strong>{{ node.name }}</strong>
</template>

<script>

import Vue from 'vue'
import { extend } from 'quasar'

// WARNING: this property is also used for widgets
Vue.config.optionMergeStrategies.metadata = function (parent, child) {
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

export default {
    name: 'NodeBase',

    props: ['flow', 'node'],

    metadata: {
      height: 48,
      width: 200
    }
}

</script>
