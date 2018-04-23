<template>
  <div class="absolute-center">
    <q-knob
      :value="value"
      :min="min"
      :max="max"
      readonly
    >
      {{value}} <span class="unit">{{unit}}</span>
    </q-knob>
  </div>
</template>

<script>
export default {
    name: 'WKnob',

    data () {
        return {
            value: 0,
            unit: "",
            min: 0,
            max: 100
        }
    },

}
</script>

<style scoped>

</style>
