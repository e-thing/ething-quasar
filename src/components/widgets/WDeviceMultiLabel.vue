<template>
  <w-device-layout :resource="resource" v-bind="$attrs">
    <div class="fit column items-center justify-center">
      <div class="col-auto" v-for="(item, index) in computedItems" :key="index">
        <span v-if="item.key" class="key">
            {{ item.key }} :
        </span>
        <span class="value">
            {{ item.value }}
        </span>
        <span v-if="item.unit" class="unit">
            {{ item.unit }}
        </span>
      </div>
    </div>
  </w-device-layout>
</template>

<script>
import WResource from './WResource'
import WDeviceLayout from './WDeviceLayout'

export default {
    name: 'WDeviceMultiLabel',

    mixins: [WResource],

    components: {
      WDeviceLayout
    },

    props: {
      items: Array
    },

    data () {
        return {
            computedItems: [],
            lastUpdate: null
        }
    },

    watch: {
      r () {
        if (!this.lastUpdate || this.r.modifiedDate() > this.lastUpdate) {
          this.update()
        }
      }
    },

    methods: {
      update () {
        this.lastUpdate = this.r.modifiedDate()

        this.computedItems = this.items.map( item => {
          var c = {
            key: item.key,
            unit: item.unit,
            value: '?'
          }

          if (item.fn) {
            c.value = '...'
            this.r.execute(item.fn).then(v => {
              c.value = v
            })
          } else if (item.dataProp) {
            c.value = this.r.data(item.dataProp, '')
          }

          return c
        })
      }
    },

    mounted () {
      this.update()
    },

    meta: {
      name: 'multilabel',
      minWidth: 50,
      minHeight: 50
    }




}
</script>

<style lang="stylus" scoped>
@import '~variables'

.key
  color $faded

.value
  color $primary

.unit
  color $blue-4
</style>
