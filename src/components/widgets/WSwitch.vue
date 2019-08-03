<template>
  <div class="absolute-center">
    <q-toggle :value="!!resource.attr(attr)" @input="toggle" :color="color" keep-color :disable="writing" />
  </div>
</template>

<script>
import WResource from './WResource'


export default {
    name: 'WSwitch',

    mixins: [WResource],

    props: {
      attr: String,
      set: Function
    },

    data () {
      return {
        writing: false
      }
    },

    methods: {

      toggle (state) {
        this.writing = true
        Promise.resolve(this.set(this.resource, state)).catch(err => {
          this.setError(err)
        }).finally(() => {
          this.writing = false
        })
      }
    },

}
</script>

<style scoped>

</style>
