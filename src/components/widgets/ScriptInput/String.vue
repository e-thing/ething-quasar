<template>
  <q-input type="text" :value="value" @input="$emit('input', $event)" v-bind="$attrs"/>
</template>

<script>

export default {
  name: 'StringInput',

  props: ['value']

}

</script>
