<template>
  <q-page padding>

    <div class="q-my-md q-display-1 q-display-1-opacity">{{ resource.basename() }}</div>

    <!-- atttributes -->
    <p v-if="data">
      <div class="q-my-md q-title q-title-opacity">Attributes</div>
      <div class="row">
        <template v-for="(value, key) in data">
          <div class="col-xs-12 col-sm-2 key text-primary">{{ key }}</div>
          <div class="col-xs-12 col-sm-10 value text-faded">{{ value }}</div>
        </template>
      </div>
    </p>

    <!-- resource -->
    <p v-if="children.length">
      <div class="q-my-md q-title q-title-opacity">Resources</div>
      <q-item v-for="child in children" :key="child.id()" :to="$ui.open(child)">
        <q-item-side :icon="$ething.meta.get(child).icon" inverted :color="$ething.meta.get(child).color" />
        <q-item-main>
          <q-item-tile label>{{ child.basename() }}</q-item-tile>
          <q-item-tile v-if="child.isTypeof('Device')" label><small class="text-faded">{{ child.type() }}</small></q-item-tile>
        </q-item-main>
        <q-item-side v-if="child.isTypeof('Table')" right>
          <q-btn icon="insert chart" round flat dense color="secondary" @click.stop="$router.push('/chart/' + child.id())"/>
        </q-item-side>
        <q-item-side v-if="child.isTypeof('File')" right>{{ $ui.sizeToString(child.size()) }}</q-item-side>
        <q-item-side v-if="child.isTypeof('Table')" right>{{ child.length() }} rows</q-item-side>
        <q-item-side right>{{ $ui.dateToString(child.modifiedDate()) }}</q-item-side>
      </q-item>
    </p>

    <!-- api -->
    <p>
      <div class="q-my-md q-title q-title-opacity">API</div>
      <device-api :device="resource" />
    </p>


  </q-page>
</template>

<script>

import DeviceApi from '../components/DeviceApi'

export default {
  name: 'PageDevice',

  components: {
    DeviceApi
  },

  computed: {
    resource () {
      var id = this.$route.params.id
      var r = this.$store.getters['ething/findOneById'](id)
      if (id && id.length) {
        if (!r || !r.isTypeof('Device')) {
          this.$router.replace('/404')
        }
      }
      return r
    },

    children () {
      return this.$store.getters['ething/filter'](r => {
        return r.createdBy() === this.resource.id()
      })
    },

    tables () {
      return this.children.filter(r => {
        return r.isTypeof('Table')
      })
    },

    files () {
      return this.children.filter(r => {
        return r.isTypeof('Files')
      })
    },

    devices () {
      return this.children.filter(r => {
        return r.isTypeof('Devices')
      })
    },

    data () {
      var data = this.resource.data()
      return Object.keys(data).length === 0 ? null : data
    }

  },



}
</script>

<style>
</style>
