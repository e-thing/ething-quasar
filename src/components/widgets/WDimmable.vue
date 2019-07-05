<template>
  <div class="absolute-center">
    <q-knob
      :value="value"
      :min="min"
      :max="max"
      :disable="writing"
      :color="color"
      @change="setLevel"
    >
      {{value}} <small class="unit" style="filter: brightness(90%);">{{unit}}</small>
    </q-knob>
  </div>
</template>


<script>
import WResource from './WResource'


export default {
    name: 'WDimmable',

    mixins: [WResource],

    props: {
      unit: {
        type: String,
        default: '%'
      },
      min: {
        type: Number,
        default: 0
      },
      max: {
        type: Number,
        default: 100
      },
      attr: String,
      set: Function,
    },

    data () {
      return {
        writing: false
      }
    },

    computed: {
      value () {
        return this.resource.attr(this.attr)
      }
    },

    methods: {

      setLevel (value) {
        this.writing = true
        Promise.resolve(this.set(this.resource, value)).catch(err => {
          this.setError(err)
        }).finally(() => {
          this.writing = false
        })
      }
    }


}
</script>

<style scoped>

</style>
