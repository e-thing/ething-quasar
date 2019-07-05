<template>
  <div class="absolute-center">
    <q-icon v-if="icon" :name="icon" class="vertical-middle"/>
    <span class="value vertical-middle" :style="{color: color}">
        {{ resource.attr(attr) }}
    </span>
    <small v-if="unit" class="unit vertical-middle" style="filter: brightness(90%);">
        {{ unit }}
    </small>
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
    },


}
</script>
