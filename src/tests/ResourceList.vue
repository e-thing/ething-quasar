<template>
  <div>

    <q-toggle v-model="dense" label="dense"/>
    <q-toggle v-model="readonly" label="read only"/>
    <q-toggle v-model="tree" label="tree"/>
    <q-toggle v-model="heightfixed" label="heightfixed"/>

    <resource-list
      :categories="['resources/Device', 'resources/File', 'resources/Table', 'resources/Flow', 'interfaces/Sensor', 'interfaces/Thermometer']"
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
    }

  },

}
</script>

<style lang="stylus">


</style>
