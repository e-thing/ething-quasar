<template>
  <div>
    <div>
      {{ resourceFilter.length }} resources selected
    </div>

    <div>
      <q-toggle v-model="clearable" label="clearable"/>
      <q-toggle v-model="useId" label="useId"/>
      <q-toggle v-model="createEnabled" label="createEnabled"/>
      <q-toggle v-model="sort" label="sort"/>
      <q-toggle v-model="filter" label="filter"/>
    </div>

    <resource-select
      v-model="resourceFilter"
      :clearable="clearable"
      label="Resource Filter"
      multiple
      :useId="useId"
      :disableCreate="!createEnabled"
      :sort="sort ? 'name': ''"
      :enableFilter="filter"
    />

  </div>
</template>

<script>

export default {
  name: 'TestResourceSelect',

  data () {

    return {
      resourceFilter: [],
      clearable: true,
      useId: false,
      createEnabled: true,
      sort: true,
      filter: true
    }

  },


}
</script>

<style lang="stylus">


</style>
