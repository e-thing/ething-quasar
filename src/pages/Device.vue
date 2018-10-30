<template>
  <q-page padding>

    <div class="q-my-md q-display-1 q-display-1-opacity">
      <q-icon :name="$ethingUI.get(resource).icon" class="vertical-middle"/>
      <span class="vertical-middle">
        {{ resource.basename() }}
      </span>

      <q-btn class="float-right" flat :dense="$q.screen.lt.sm" label="settings" icon="settings" @click="$router.push('/resource/' + resource.id())"/>

    </div>

    <div>
      <q-chip small square detail icon="access time" v-if="resource.lastSeenDate()" class="q-mr-sm">
        {{ $ethingUI.utils.dateToString(resource.lastSeenDate()) }}
      </q-chip>
      <resource-battery-chip :resource="resource" class="vertical-middle q-mr-sm" square/>
      <q-chip small square detail icon="location_on" v-if="resource.location()" class="q-mr-sm">
        {{ resource.location() }}
      </q-chip>

    </div>

    <div v-if="createdBys.length" class="q-py-md">
      <template v-for="(item, index) in createdBys">
        <span v-if="index>0"> - </span>
        <span class="createdby-item" @click="$ethingUI.open(item)">{{ item.basename() }}</span>
      </template>
    </div>


    <!-- component -->
    <device-component :device="resource"/>


    <!-- attributes -->
    <q-card  v-if="attributes.length>0" class="q-my-md attributes" :class="{detailled: showDetailledAttributes}">
      <q-card-title class="bg-primary text-white">
        <q-icon name="mdi-format-list-bulleted" class="vertical-middle"/>
        <span class="vertical-middle">
          Attributes
        </span>
        <q-btn class="float-right" flat rounded size="small" :label="showDetailledAttributes ? 'less' : 'more'" :icon="showDetailledAttributes ? 'expand_less' : 'expand_more'" style="line-height: initial" @click="showDetailledAttributes = !showDetailledAttributes"/>
      </q-card-title>
      <q-card-separator />
      <q-card-main>
        <div class="row">
          <template v-for="attr in attributes">
            <div class="col-xs-12 col-sm-2 key text-secondary" :class="{detailled: attr.detailled}">{{ attr.name }}</div>
            <div class="col-xs-12 col-sm-10 value" :class="{detailled: attr.detailled}">{{ attr.value }}</div>
          </template>
        </div>
      </q-card-main>
    </q-card>

    <!-- data -->
    <q-card  v-if="data" class="q-my-md" >
      <q-card-title class="bg-primary text-white">
        <q-icon name="mdi-format-list-bulleted" class="vertical-middle"/>
        <span class="vertical-middle">
          Data
        </span>
      </q-card-title>
      <q-card-separator />
      <q-card-main>
        <div class="row">
          <template v-for="(value, key) in data">
            <div class="col-xs-12 col-sm-2 key text-secondary">{{ key }}</div>
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
    <q-card  v-if="Object.keys($ethingUI.get(resource).methods).length" class="q-my-md">
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

import DeviceApi from 'ething-quasar-core/src/components/DeviceApi'
import ResourceQItem from 'ething-quasar-core/src/components/ResourceQItem'
import ResourceBatteryChip from 'ething-quasar-core/src/components/ResourceBatteryChip'
import DeviceComponent from '../components/DeviceComponent'

export default {
  name: 'PageDevice',

  components: {
    DeviceApi,
    ResourceQItem,
    ResourceBatteryChip,
    DeviceComponent
  },

  data () {
    return {
      showDetailledAttributes: false
    }
  },

  computed: {
    resource () {
      var id = this.$route.params.id
      var r = this.$store.getters['ething/get'](id)
      if (id && id.length) {
        if (!r || !r.isTypeof('resources/Device')) {
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
        return r.isTypeof('resources/Table')
      })
    },

    files () {
      return this.children.filter(r => {
        return r.isTypeof('resources/File')
      })
    },

    devices () {
      return this.children.filter(r => {
        return r.isTypeof('resources/Device')
      })
    },

    data () {
      var data = this.resource.data()
      return data && Object.keys(data).length > 0 ? data : undefined
    },

    attributes () {
      var props = this.$ethingUI.get(this.resource).properties
      var attributes = []
      var skippedFields = ['name', 'data', 'description']
      var detailledFields = ['id', 'modifiedDate', 'createdBy', 'type', 'extends', 'public', 'createdDate', 'methods', 'battery', 'location', 'interfaces', 'connected', 'lastSeenDate']
      for(let name in props) {
        if (skippedFields.indexOf(name) !== -1) continue

        let prop = props[name]
        let value = prop.getFormatted(this.resource)

        attributes.push({
          name,
          value,
          detailled: detailledFields.indexOf(name) !== -1
        })
      }
      return attributes
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

<style lang="stylus">
@import '~variables'

.attributes
  .key.detailled, .value.detailled
    display none
  &.detailled
    .key.detailled, .value.detailled
      display block

.createdby-item
  color $faded
  cursor pointer
  &:hover
    color $primary

</style>
