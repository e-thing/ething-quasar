<template>
  <div class="form-schema-string">
    <input v-bind:value="model" v-on:input="value = $event.target.value"/>
  </div>
</template>

<script>

export default {
  name: 'FormSchemaString',

  props: {
    schema: Object,
    model: {
      type: String,
      default: ''
    }
  },

  data: function () {
    return {
      value: this.model
    }
  },

  watch: {
    value: function (val, oldVal) {
      console.log('FormSchemaString value changed to ' + val)
      this.$emit('update:model', val)
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
