<template>
  <q-page padding>

    <div class="q-my-md q-display-1 q-display-1-opacity">
      {{ resource.basename() }}
      <q-btn class="float-right" flat label="settings" icon="settings" @click="$router.push('/resource/' + resource.id())"/>
    </div>

    <q-breadcrumbs v-if="createdBys.length" class="q-py-md">
      <q-breadcrumbs-el v-for="(item, index) in createdBys" :key="index" :label="item.basename()" :to="$ui.route(item)" />
      <q-breadcrumbs-el label="" />
    </q-breadcrumbs>

    <div v-if="attr" class="q-py-md">
      <div class="q-my-md q-title q-title-opacity">Attributes</div>
      <div class="row">
        <template v-for="(value, key) in attr">
          <div class="col-xs-12 col-sm-2 key text-primary">{{ key }}</div>
          <div class="col-xs-12 col-sm-10 value text-faded">{{ value }}</div>
        </template>
      </div>
    </div>

    <!-- resource -->
    <div v-if="children.length" class="q-py-md">
      <div class="q-my-md q-title q-title-opacity">Resources</div>
      <q-item v-for="child in children" :key="child.id()" :to="$ui.route(child)">
        <q-item-side :icon="$meta.get(child).icon" inverted :color="$meta.get(child).color" />
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
    </div>

    <!-- api -->
    <div class="q-py-md">
      <div class="q-my-md q-title q-title-opacity">API</div>
      <device-api :device="resource" />
    </div>


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
      var r = this.$store.getters['ething/get'](id)
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

    attr () {
      var data = this.resource.data()
      return data && Object.keys(data).length > 0 ? data : undefined
    },

    createdBys () {
      var createdBys = []
      var p = this.resource.createdBy()

      while (p) {
        var pr = this.$ething.arbo.get(p)
        if (!pr) break
        createdBys.push(pr)
        p = pr.createdBy()
      }

      return createdBys.reverse()
    }

  },



}
</script>

<style>
</style>
