<template>
  <q-btn class="" :label="node.name" @click="_inject"/>
</template>

<script>

import Input from './Input'

export default {
    name: 'NodeButton',

    mixins: [Input],

    methods: {
      _inject () {
        this.inject(new Date().getTime() / 1000)
      }
    }
}

</script>
