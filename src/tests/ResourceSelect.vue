<template>
  <div>
    <div>
      {{ model.length }} resources selected
    </div>

    <div>
      <q-toggle v-model="clearable" label="clearable"/>
      <q-toggle v-model="useId" label="useId"/>
      <q-toggle v-model="createEnabled" label="createEnabled"/>
      <q-toggle v-model="filter" label="filter"/>
      <q-toggle v-model="grouped" label="group"/>
    </div>

    <resource-select
      v-model="model"
      :groups="grouped ? ['interfaces/Sensor', 'interfaces/Thermometer'] : null"
      :clearable="clearable"
      label="Resource Select"
      multiple
      :useId="useId"
      :disableCreate="!createEnabled"
      :enableFilter="filter"
    />

  </div>
</template>

<script>

export default {
  name: 'TestResourceSelect',

  data () {

    return {
      model: [],
      clearable: true,
      useId: false,
      createEnabled: true,
      sort: true,
      filter: true,
      grouped: false,
    }

  },


}
</script>

<style lang="stylus">


</style>
