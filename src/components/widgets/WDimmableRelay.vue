<template>
  <div class="fit">
    <q-resize-observer @resize="updateLayout" />
    <div class="absolute-center">
      <q-knob
        class="q-knob--no-shadow"
        show-value
        :value="value"
        :disable="writing"
        :min="0"
        :max="100"
        :size="knobSize + 'px'"
        :thickness="thickness"
        @change="__execute('setLevel', $event)"
        color="grey-5"
        center-color="transparent"
        track-color="grey-2"
      >
        <q-avatar :style="{backgroundColor: state ? color : '#bdbdbd'}" text-color="white" @click.stop="__execute('setState', !state)" font-size="30%" :size="knobSize*(1-thickness)+2 + 'px'">{{ state ? 'ON' : 'OFF' }}</q-avatar>
      </q-knob>
    </div>
  </div>
</template>


<script>
import WResource from './WResource'


export default {
    name: 'WDimmableRelay',

    mixins: [WResource],

    props: {
      unit: {
        type: String,
        default: '%'
      },
    },

    data () {
      return {
        writing: false,
        thickness: 0.25,
        knobSize: 32
      }
    },

    computed: {
      value () {
        return this.resource.attr('level')
      },
      state () {
        return this.resource.attr('state')
      }
    },

    methods: {

      __execute (fn, data) {
        this.writing = true
        Promise.resolve(this.resource.execute(fn, data)).catch(err => {
          this.setError(err)
        }).finally(() => {
          this.writing = false
        })
      },

      updateLayout (size) {
        var len = Math.max(Math.min(size.width, size.height), 64)
        this.knobSize = parseInt(len * 0.8)
      },

    }


}
</script>

<style>
.q-knob--no-shadow:focus:before {
  box-shadow: none !important;
}
</style>
