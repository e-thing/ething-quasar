<template>
  <w-device-layout :resource="resource" v-bind="$attrs">
    <div class="fit column items-center justify-center">
      <div class="col-auto" v-for="(item, index) in computedItems" :key="index">
        <span v-if="item.label" class="label">
            {{ item.label }} :
        </span>
        <span class="value" :style="item._style">
          <template v-if="item.icon">
            <img v-if="isUrlIcon(item.value)" :src="item.value" class="vertical-middle"/>
            <q-icon v-else :name="item.value"/>
          </template>
          <template v-else>
            {{ item.value }}
          </template>
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
import WDeviceRead from './WDeviceRead'

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

        var computedItems = this.items.map( (item, index) => {
          var c = Object.assign({
            label: '',
            value: undefined,
            unit: null,
            color: null, // the color of the value
            offset: 0, // add this number to the value
            coefficient: 0, // multiply the value by this number
            map: {}, // map value to another value, if number, the value associated to the closest key is returned
            icon: false, // if true, the value is an icon name
            done: null, // function executed once the value has been resolved
            nullValue: undefined, // the value to print in case the walue is null or undefined
            skipIfNull: false, // skip this label if the value is null or undefined

            // private
            _loading: true,
            _error: false,
            _prev: this.computedItems[index],
            _promise: null,
            _style: {},
            _skipped: false
          }, item)

          c._promise = WDeviceRead.read(c, this.r).then(v => {
            c.value = v
          }).catch(err => {
            c._error = true
          }).finally(() => {
            c._loading = false

            if (typeof c.done === 'function') {
              c.done.call(c, c)
            }

            if (c.color) {
              c._style.color = c.color
            }

            this.computedValue(c)

            if (c.skipIfNull && (c.value === null || typeof c.value === 'undefined')) {
              c._skipped = true
            }

          })

          return c
        })

        Promise.all(computedItems.map(item => item._promise)).then(() => {
          this.computedItems = computedItems.filter(i => !i._skipped)
        })
      },

      computedValue (item) {

        if (item.nullValue !== null && typeof item.nullValue !== 'undefined' && (item.value === null || typeof item.value === 'undefined')) {
          item.value = item.nullValue
        }

        if (item.coefficient) {
          item.value *= item.coefficient
        }
        if (item.offset) {
          item.value += item.offset
        }
        if (item.map) {
          var map;
          if (Array.isArray(item.map)) {
            map = item.map
          } else {
            map = []
            for (var k in item.map) {
              map.push({
                key: k,
                value: item.map[k]
              })
            }
          }

          var f = map.find(i => i.key === item.value)
          if (!f) f = map.find(i => i.key === '*')
          if (f) {
            item.value = f.value
          } else if (typeof item.value === 'number') {
            // get the nearest key
            var values = map.map(i => i.key).filter(k => typeof k === 'number').sort()
            var value = item.value
            var diff = null
            var res = null
            values.forEach(v => {
              var d = Math.abs(v - value)
              if (diff === null || d <= diff) {
                diff = d
                res = v
              }
            })
            if (res !== null) {
              f = map.find(i => i.key === res)
              item.value = f.value
            }
          }
        }

        return item.value
      },

      isUrlIcon (value) {
        return /^https?:\/\//.test(value)
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

.label
  color $faded

.value
  color $primary

.unit
  color $blue-4
</style>
