<template>
  <q-btn class="" :label="node.name" @click.stop="_inject" />
</template>

<script>

import Input from './Input'

export default {
    name: 'NodeButton',

    mixins: [Input],

    methods: {
      _inject (evt) {
        this.inject(new Date().getTime() / 1000)
      },
    }
}

</script>
