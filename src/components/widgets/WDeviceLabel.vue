<template>
  <div class="absolute-center text-h6 text-no-wrap q-gutter-x-xs ellipsis">
    <q-icon v-if="icon" :name="icon"/>
    <span class="value" :style="{color: color}">{{ __map(resource.attr(attr)) }}</span>
    <small v-if="unit" class="unit" style="filter: brightness(90%);">{{ unit }}</small>
  </div>
</template>

<script>
import WResource from './WResource'

export default {
    name: 'WDeviceLabel',

    mixins: [WResource],

    props: {
      unit: String,
      attr: String,
      icon: String,
      map: Array
    },

    methods: {
      __map (value) {
        var map = this.map
        if (map && map.length) {
          for (var i in map) {
            if (map[i].key === value) return map[i].value
          }

        }
        if (value === null || value === undefined) return '?'
        return value
      }
    }

}
</script>
