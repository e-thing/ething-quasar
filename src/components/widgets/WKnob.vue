<template>
  <w-layout :title="title">
    <slot>
      <div class="absolute-center">
        <q-knob
          :value="value"
          :min="min"
          :max="max"
          readonly
          color="primary"
        >
          {{value}} <span class="unit">{{unit}}</span>
        </q-knob>
      </div>
    </slot>
  </w-layout>
</template>

<script>
import WLayout from './WLayout'

export default {
    name: 'WKnob',

    components: {
      WLayout
    },

    data () {
        return {
            value: 0,
            unit: "",
            min: 0,
            max: 100,
            title: undefined
        }
    },

}
</script>

<style scoped>

</style>
