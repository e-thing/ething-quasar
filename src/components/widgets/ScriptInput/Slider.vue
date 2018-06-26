<template>
  <q-slider :value="value" @input="$emit('input', $event)" v-bind="$attrs" label/>
</template>

<script>

export default {
  name: 'SliderInput',

  props: {
    value: {
      default: 0
    }
  },

  meta: {
    options: {
      properties: {
        min: {
          type: 'number',
          required: true
        },
        max: {
          type: 'number',
          required: true
        },
      }
    }
  }

}

</script>
