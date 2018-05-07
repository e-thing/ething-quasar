<template>
  <div class="column fit">
    <div class="col-auto text-center text-faded">
      {{ title }}
    </div>
    <div class="col relative-position">
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
    </div>
  </div>
</template>

<script>
export default {
    name: 'WKnob',

    props: ['title'],

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
