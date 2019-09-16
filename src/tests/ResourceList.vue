<template>
  <div>

    <q-toggle v-model="dense" label="dense"/>
    <q-toggle v-model="readonly" label="read only"/>
    <q-toggle v-model="tree" label="tree"/>
    <q-toggle v-model="heightfixed" label="heightfixed"/>
    <q-toggle v-model="categories" label="categories"/>
    <q-toggle v-model="grouped" label="group"/>

    <resource-list
      :categories="categories ? ['resources/Device', 'resources/File', 'resources/Table', 'resources/Flow'] : null"
      :groups="grouped ? ['interfaces/Sensor', 'interfaces/Thermometer'] : null"
      class="bg-white"
      :dense="dense"
      :readonly="readonly"
      :tree="tree"
      create-modal
      :style="heightfixed ? {height: '450px'} : null"
    />

  </div>
</template>

<script>

export default {
  name: 'TestResourceList',

  data () {

    return {
      dense: false,
      readonly: false,
      tree:  false,
      heightfixed: false,
      grouped: false,
      categories: true
    }

  },

}
</script>

<style lang="stylus">


</style>
