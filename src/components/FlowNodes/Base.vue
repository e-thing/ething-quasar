<template>
  <strong class="ellipsis">{{ node.name }}</strong>
</template>

<script>

import Vue from 'vue'
import { extend } from 'quasar'

// WARNING: this property is also used for widgets
Vue.config.optionMergeStrategies.metadata = function (parent, child) {
    return extend(true, {}, parent || {}, child || {})
}

export default {
    name: 'NodeBase',

    props: ['node'],

    metadata: {
      height: 48,
      width: 200
    }
}

</script>
