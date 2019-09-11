<template>
  <q-page padding class="bg-white">

    <q-select v-model="selectedTest" :options="testOptions" label="Test" />

    <q-separator spaced/>

    <component :is="__component"/>

  </q-page>
</template>

<script>

import tests from '../tests'


export default {
  name: 'PageTest',

  data () {

    return {
      testOptions: Object.keys(tests),
      selectedTest: null
    }

  },

  computed: {
    __component () {
      if (this.selectedTest) {
        return tests[this.selectedTest]
      }
    }
  },

  watch: {
    selectedTest (val) {
      if (val) {
        this.$router.replace('/test/' + val)
      }
    }
  },

  methods: {

  },

  mounted () {
    this.selectedTest = this.$route.params.id
  }
}
</script>

<style lang="stylus">


</style>
