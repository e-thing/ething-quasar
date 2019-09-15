<template>
  <div>

    <div v-for="type in types" :key="type">
      <q-toggle v-model="val[type]" :label="type"/>
    </div>

    <div>
      <q-toggle v-model="custom" label="custom"/>
    </div>

    <q-toggle v-model="open" label="open"/>
    <q-toggle v-model="show" label="show"/>

    <resource-create-modal
      :types="__types"
      v-model="show"
      :open="open"
    />

  </div>
</template>

<script>

export default {
  name: 'TestResourceCreate',

  data () {

    return {
      types: ['resources/Device', 'resources/File', 'resources/Resource'],
      val: {
        'resources/Device': true
      },
      all: false,
      open: false,
      show: false,
      custom: false
    }

  },

  computed: {
    __types () {
      var t = []
      for(var k in this.val) {
        if (this.val[k]) {
          t.push(k)
        }
      }
      if (this.custom) {
        t.push({
          label: 'custom entry',
          click () {
            alert('custom entry clicked')
          }
        })
      }
      return t
    }
  }

}
</script>

<style lang="stylus">


</style>
