<template>
  <div class="absolute-center">
    <q-toggle v-model="state" />
  </div>
</template>

<script>

import WResource from './WResource'

export default {
    name: 'WSwitch',

    mixins: [WResource],

    data () {
        return {
            state: false
        }
    },

    watch: {
      r () {
        this.update()
      }
    },

    methods: {
      update () {
        console.log('WSwitch update...')
        this.r.getState().done(v => {
          this.state = v
        })
      }
    },

    mounted () {
      this.update()
    },

    minWidth: 1,
    minHeight: 1



}
</script>

<style scoped>

</style>
