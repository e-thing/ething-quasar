<template>
  <div>
    <div>
      {{ resourceFilter.length }} resources selected
    </div>

    <resource-select
      v-model="resourceFilter"
      clearable
      label="Resource Filter"
      stack-label
      borderless
      multiple
    />

  </div>
</template>

<script>

export default {
  name: 'TestResourceSelect',

  data () {

    return {
      resourceFilter: [],
    }

  },


}
</script>

<style lang="stylus">


</style>
