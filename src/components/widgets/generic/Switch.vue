<template>
  <div class="fit row no-wrap">
    <div class="col-6 q-pa-xs">
      <q-btn
        class="fit no-border-radius"
        :label="labelOn"
        :icon="iconOn"
        :disable="writing"
        @click="__set(true)"
        flat
        :size="__value ? '150%' : '80%'"
        :style="__value ? __activeStyle : __passiveStyle"
      />
    </div>
    <div class="col-6 q-pa-xs">
      <q-btn
        class="fit no-border-radius"
        :label="labelOff"
        :icon="iconOff"
        :disable="writing"
        @click="__set(false)"
        flat
        :size="__value ? '80%' : '150%'"
        :style="__value ? __passiveStyle : __activeStyle"
      />
    </div>
  </div>
</template>

<script>
import Base from '../Base'


export default {
    name: 'WSwitch',

    mixins: [Base],

    props: {
      labelOn: {
        type: String,
        default: 'On'
      },
      labelOff: {
        type: String,
        default: 'Off'
      },
      iconOn: String,
      iconOff: String,

      value: {},
      set: Function
    },

    data () {
      return {
        writing: false
      }
    },

    computed: {
      __value () {
        return !!this.value
      },
      __activeStyle () {
        return {
          backgroundColor: this.primaryColor,
          color: 'white',
        }
      },
      __passiveStyle () {
        return {}
      }
    },

    methods: {
      __set (val) {
        if (this.set) {
          this.writing = true
          Promise.resolve(this.set(val)).catch(err => {
            this.setError(err)
          }).finally(() => {
            this.writing = false
          })
        }
      }
    }

}
</script>
