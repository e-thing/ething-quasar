<template>
  <div class="fit" :class="vertical ? 'column no-wrap items-stretch' : 'row'">
    <q-resize-observer @resize="updateLayout" />
    <div class="col no-wrap" :class="controlsVertical ? 'column items-stretch' : 'row items-center'">
      <q-btn stretch class="col" flat icon="mdi-chevron-up" @click="__up()"/>
      <div class="col-auto text-center text-no-wrap q-ma-md" :style="{fontSize: valueFontSize}">
        {{ __targetTemperature }} <span style="font-size: 50%;">{{ __unit }}</span>
      </div>
      <q-btn stretch class="col" flat icon="mdi-chevron-down" @click="__down()"/>
    </div>
    <q-btn-dropdown class="col-auto" flat :label="__mode">
      <q-list>
        <q-item
          clickable
          v-close-popup
          v-for="mode in __modes"
          :key="mode"
          @click="__setMode(mode)">
          <q-item-section>
            <q-item-label>{{ mode }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </div>
</template>

<script>
import Base from './Base'


export default {
    name: 'WThermostat',

    mixins: [Base],

    data () {
      return {
        writing: false,
        vertical: true,
        controlsVertical: false,
        valueFontSize: '100%'
      }
    },

    computed: {
      __targetTemperature () {
        return this.resource.attr('target_temperature') || 0
      },

      __unit () {
        return this.$ethingUI.get(this.resource).properties.target_temperature.unit
      },

      __mode () {
        return this.resource.attr('mode')
      },

      __modes () {
        return this.$ethingUI.get(this.resource).properties.mode.enum
      },
    },

    methods: {

      __up () {
        this.writing = true
        Promise.resolve(this.resource.execute('set_target_temperature', this.__targetTemperature + 1.)).catch(err => {
          this.setError(err)
        }).finally(() => {
          this.writing = false
        })
      },

      __down () {
        this.writing = true
        Promise.resolve(this.resource.execute('set_target_temperature', this.__targetTemperature - 1.)).catch(err => {
          this.setError(err)
        }).finally(() => {
          this.writing = false
        })
      },

      __setMode (mode) {
        this.writing = true
        Promise.resolve(this.resource.execute('set_mode', mode)).catch(err => {
          this.setError(err)
        }).finally(() => {
          this.writing = false
        })
      },

      updateLayout (size) {
        if (Math.max(size.width, size.height) < 200) {
          this.vertical = true
          this.controlsVertical = false
          this.valueFontSize = '100%'
        } else {
          var ratio = size.width / size.height;
          this.vertical = ratio < 4
          this.controlsVertical = ratio < 0.5
          this.valueFontSize = Math.min(size.width, size.height) > 250 ? '400%' : '200%'
        }
      }

    }


}
</script>
