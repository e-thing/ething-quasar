<template>
  <div class="absolute-center">
    <q-toggle :value="state" @input="toggle" />
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
        this.r.getState().then(v => {
          this.state = v
        })
      },

      toggle (state) {
        console.log('WSwitch toggle...', state)
        this.r.setState(state).then(() => {
          this.state = state
        })
      }
    },

    mounted () {
      this.update()
    },

    meta: {
      minWidth: 50,
      minHeight: 50
    }


}
</script>

<style scoped>

</style>
