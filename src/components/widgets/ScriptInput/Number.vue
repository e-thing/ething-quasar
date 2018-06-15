<template>
  <q-input type="number" :value="value" @input="$emit('input', $event)" v-bind="$attrs"/>
</template>

<script>

export default {
  name: 'NumberInput',

  props: ['value'],

  meta: {
    options: {
      properties: {
        min: {
          type: 'number'
        },
        max: {
          type: 'number'
        },
      }
    }
  }

}

</script>
