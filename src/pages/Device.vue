<template>
  <q-page padding>

    <div class="q-my-md q-display-1 q-display-1-opacity">
      <q-icon :name="$meta.get(resource).icon" class="vertical-middle"/>
      <span class="vertical-middle">
        {{ resource.basename() }}
      </span>
      <q-chip small detail icon="access time">
        {{ $ui.dateToString(resource.lastSeenDate()) }}
      </q-chip>
      <resource-battery-chip :resource="resource" class="vertical-middle"/>

      <q-btn class="float-right" flat rounded label="settings" icon="settings" @click="$router.push('/resource/' + resource.id())"/>
    </div>

    <q-breadcrumbs v-if="createdBys.length" class="q-py-md">
      <q-breadcrumbs-el v-for="(item, index) in createdBys" :key="index" :label="item.basename()" :to="$ui.route(item)" />
      <q-breadcrumbs-el label="" />
    </q-breadcrumbs>

    <!-- widget -->
    <!-- <resource-widget :resource="resource" no-header no-footer inline/> -->

    <!-- data -->
    <q-card  v-if="attr" class="q-my-md" >
      <q-card-title class="bg-primary text-white">
        <q-icon name="mdi-format-list-bulleted" class="vertical-middle"/>
        <span class="vertical-middle">
          Data
        </span>
      </q-card-title>
      <q-card-separator />
      <q-card-main>
        <div class="row">
          <template v-for="(value, key) in attr">
            <div class="col-xs-12 col-sm-2 key">{{ key }}</div>
            <div class="col-xs-12 col-sm-10 value">{{ value }}</div>
          </template>
        </div>
      </q-card-main>
    </q-card>

    <!-- resource -->
    <q-card  v-if="children.length" class="q-my-md">
      <q-card-title class="bg-primary text-white">
        <q-icon name="mdi-database" class="vertical-middle"/>
        <span class="vertical-middle">
          Resources
        </span>
      </q-card-title>
      <q-card-separator />
      <q-card-main>
        <q-list no-border>
          <resource-q-item v-for="child in children" :key="child.id()" :resource="child" />
        </q-list>
      </q-card-main>
    </q-card>

    <!-- api -->
    <q-card  v-if="children.length" class="q-my-md">
      <q-card-title class="bg-primary text-white">
        <q-icon name="mdi-database" class="vertical-middle"/>
        <span class="vertical-middle">
          API
        </span>
      </q-card-title>
      <q-card-separator />
      <q-card-main>
        <device-api :device="resource" />
      </q-card-main>
    </q-card>


  </q-page>
</template>

<script>

import DeviceApi from '../components/DeviceApi'
import ResourceQItem from '../components/ResourceQItem'
import ResourceBatteryChip from '../components/ResourceBatteryChip'
import ResourceWidget from '../components/ResourceWidget'

export default {
  name: 'PageDevice',

  components: {
    DeviceApi,
    ResourceQItem,
    ResourceBatteryChip,
    ResourceWidget
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
