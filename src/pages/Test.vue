<template>
  <q-page padding>

    <json-formatter :value="data" :options="{}" />

  </q-page>
</template>

<script>
import JsonFormatter from '../components/JsonFormatter'

export default {
  name: 'PageTest',

  components: {
    JsonFormatter
  },

  data () {



    return {
      data: {
        'obj': 45
      }
    }

  },

  methods: {
  },

  mounted () {

  }
}
</script>

<style>

</style>
