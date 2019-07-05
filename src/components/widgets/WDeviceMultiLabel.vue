<template>
  <div class="fit column items-center justify-center">
    <resource-observable :resource="resource" @change="update" />

    <div class="col-auto" v-for="(item, index) in computedItems" :key="index">
      <span v-if="item.label" class="label text-faded">
          {{ item.label }} :
      </span>
      <span class="value" :style="{color: item.color}">
        <template v-if="item.icon">
          <img v-if="isUrlIcon(item.value)" :src="item.value" class="vertical-middle"/>
          <q-icon v-else :name="item.value"/>
        </template>
        <template v-else>
          {{ item.value }}
        </template>
      </span>
      <small v-if="item.unit" class="unit" style="filter: brightness(90%);">
          {{ item.unit }}
      </small>
    </div>
  </div>
</template>

<script>
import WResource from './WResource'


export default {
    name: 'WDeviceMultiLabel',

    mixins: [WResource],

    props: {
      items: Array
    },

    data () {
        return {
            computedItems: [],
        }
    },

    methods: {
      update () {
        var computedItems = this.items.map( (item, index) => {
          var c = Object.assign({
            attr: undefined, // the resource attribute to get value from
            label: '',
            value: undefined,
            unit: null,
            color: this.color, // the color of the value
            offset: 0, // add this number to the value
            coefficient: 0, // multiply the value by this number
            map: {}, // map value to another value, if number, the value associated to the closest key is returned
            icon: false, // if true, the value is an icon name
            update: null, // function(item, value) : is called each time the value changed
            nullValue: undefined, // the value to print in case the walue is null or undefined
            skipIfNull: false, // skip this label if the value is null or undefined

            // private
            _skipped: false
          }, item)

          if (c.attr) {
            c.value = this.resource.attr(c.attr)
          } else if (typeof c.value === 'function') {
            c.value = c.value.call(this, c)
          }

          if (typeof c.update === 'function') {
            c.update.call(this, c, c.value)
          }

          this.computedValue(c)

          if (c.skipIfNull && (c.value === null || typeof c.value === 'undefined')) {
            c._skipped = true
          }

          return c
        })

        this.computedItems = computedItems.filter(i => !i._skipped)
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

}
</script>
