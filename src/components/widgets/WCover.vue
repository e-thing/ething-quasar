<template>
  <div class="fit" :class="vertical ? 'row' : 'column no-wrap items-stretch'">
    <q-resize-observer @resize="updateLayout" />
    <div class="col" :class="vertical ? 'column no-wrap items-stretch' : 'row'">
      <q-btn class="col" flat icon="mdi-arrow-up-bold" @click="__up()"/>
      <q-btn class="col" flat label="stop" @click="__stop()"/>
      <q-btn class="col" flat icon="mdi-arrow-down-bold" @click="__down()"/>
    </div>
    <div class="col-auto relative-position" :style="__barStyle">
      <div :style="__barContentStyle" class="absolute"></div>
    </div>
  </div>
</template>

<script>
import Base from './Base'


export default {
    name: 'WCover',

    mixins: [Base],

    data () {
      return {
        writing: false,
        vertical: true,
      }
    },

    computed: {
      __position () {
        return Math.round(this.resource.attr('position')) || 0
      },

      __barStyle () {
        if (this.vertical) {
          return {
            width: '8px'
          }
        } else {
          return {
            height: '8px'
          }
        }
      },

      __barContentStyle () {
        if (this.vertical) {
          return {
            bottom: 0,
            width: '100%',
            height: this.__position +'%',
            backgroundColor: this.color
          }
        } else {
          return {
            left: 0,
            height: '100%',
            width: this.__position +'%',
            backgroundColor: this.color
          }
        }
      }
    },

    methods: {

      __up () {
        this.writing = true
        Promise.resolve(this.resource.execute('open_cover')).catch(err => {
          this.setError(err)
        }).finally(() => {
          this.writing = false
        })
      },

      __down () {
        this.writing = true
        Promise.resolve(this.resource.execute('close_cover')).catch(err => {
          this.setError(err)
        }).finally(() => {
          this.writing = false
        })
      },

      __stop () {
        this.writing = true
        Promise.resolve(this.resource.execute('stop_cover')).catch(err => {
          this.setError(err)
        }).finally(() => {
          this.writing = false
        })
      },

      updateLayout (size) {
        var ratio = size.width / size.height;
        this.vertical = ratio < 2
      }

    }


}
</script>
