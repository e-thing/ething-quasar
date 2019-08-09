<template>
  <q-page class="">

    <div class="bg-white" :class="$q.screen.lt.md ? 'q-py-sm' : 'q-py-lg q-px-md'" style="border-bottom: 5px solid #eee">

      <q-list dense>
        <q-item>
          <q-item-section avatar top>
            <q-avatar :icon="meta.icon" text-color="white" :color="meta.color" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-h4 ellipsis" :class="'text-' + meta.color">
              {{ resource.basename() }}
              <q-icon v-if="!resource.connected()" right name="mdi-lan-disconnect" color="warning" />

              <q-avatar v-for="(icon, key) in extendsIcons" :key="key" :icon="icon" :color="meta.color" text-color="white" size="24px" class="gt-xs q-mr-xs" />

            </q-item-label>
            <q-item-label caption>{{ meta.title }}</q-item-label>
          </q-item-section>
          <q-item-section side top>
            <q-btn
              flat
              :label="$q.screen.lt.md ? '' : 'settings'"
              color="faded"
              icon="settings"
              @click="$router.push('/resource/' + resource.id())"
            />
          </q-item-section>
        </q-item>
        <q-item :inset-level="1" v-if="createdBys.length">
          <q-item-section>
            <div>
              <template v-for="(item, index) in createdBys">
                <q-icon name="mdi-chevron-right" />
                <span class="createdby-item" @click="$ethingUI.open(item)">{{ item.basename() }}</span>
              </template>
            </div>
          </q-item-section>
        </q-item>
        <q-item :inset-level="1">
          <q-item-section>
            <div>
              <q-chip dense square icon="access_time" class="q-ma-none q-mr-sm">
                {{ $ethingUI.utils.dateToString(resource.lastSeenDate(), 'never') }}
              </q-chip>
              <resource-battery-chip :resource="resource" class="vertical-middle q-ma-none q-mr-sm" square/>
              <q-chip dense square icon="location_on" v-if="resource.location()" class="q-ma-none q-mr-sm">
                {{ resource.location() }}
              </q-chip>

            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <div class="page page-width-md">

      <!-- error -->
      <div class="page-block" v-if="resource.attr('error')">
        <q-banner class="bg-negative text-white"><q-icon left name="mdi-alert"/> {{ resource.attr('error') }}</q-banner>
      </div>

      <!-- disconnected -->
      <div class="page-block" v-if="!resource.connected()">
        <q-banner class="bg-warning text-white"><q-icon left name="mdi-lan-disconnect"/> This device is disconnected !</q-banner>
      </div>

      <!-- description -->
      <div class="page-block q-pa-md text-faded" v-if="resource.description()">
        {{ resource.description() }}
      </div>

      <!-- components -->
      <div class="page-block" v-for="(widget, key) in widgets" :key="key" v-if="widgets">
        <div class="bloc-title" v-if="widget.title">
          <q-icon :name="widget.icon" v-if="widget.icon"/>
          <span>{{ widget.title }}</span>
        </div>
        <div class="bloc-content" :class="widget.devicePage.padding ? '' : 'bloc-content-no-padding'">
          <widget :resource="resource" :component="widget.component" title="" footer="" v-bind="widget.attributes" :minHeight="widget.minHeight" :minWidth="widget.minWidth" color="#027be3"/>
        </div>
      </div>

      <!-- activity -->
      <div class="page-block">
        <div class="bloc-title">
          <q-icon name="mdi-bell"/>
          <span>Activity</span>
        </div>
        <div class="bloc-content" style="max-height: 400px;overflow: auto;">
          <resource-activity :source="activitySource" />
        </div>
      </div>

      <!-- attributes -->
      <div class="page-block attributes">
        <div class="bloc-title">
          <q-icon name="mdi-format-list-bulleted" />
          <span>Attributes</span>
          <q-btn class="float-right" flat rounded size="small" :label="showDetailledAttributes ? 'less' : 'more'" :icon="showDetailledAttributes ? 'expand_less' : 'expand_more'" style="line-height: initial" @click="showDetailledAttributes = !showDetailledAttributes"/>
        </div>
        <div class="bloc-content">
          <div class="row" v-if="attributes.length>0">
            <template v-for="attr in attributes">
              <div class="col-xs-12 col-sm-2 key text-secondary ellipsis">{{ attr.name }}</div>
              <div class="col-xs-12 col-sm-10 value text-faded ellipsis">{{ attr.value }}</div>
            </template>
          </div>
          <div v-else class="text-center text-faded">
            <small>no attributes</small>
          </div>
        </div>
      </div>

      <!-- data -->
      <div class="page-block" v-if="data">
        <div class="bloc-title">
          <q-icon name="mdi-format-list-bulleted" />
          <span>Data</span>
        </div>
        <div class="bloc-content">
          <div class="row">
            <template v-for="(value, key) in data">
              <div class="col-xs-12 col-sm-2 key text-secondary">{{ key }}</div>
              <div class="col-xs-12 col-sm-10 value">{{ value }}</div>
            </template>
          </div>
        </div>
      </div>

      <!-- resource -->
      <div class="page-block" v-if="children.length">
        <div class="bloc-title">
          <q-icon name="mdi-database" />
          <span>Resources</span>
        </div>
        <div class="bloc-content bloc-content-no-padding">
          <q-list>
            <resource-q-item v-for="child in children" :key="child.id()" :resource="child" />
          </q-list>
        </div>
      </div>

      <!-- api -->
      <div class="page-block" v-if="Object.keys(staticMeta.methods).length">
        <div class="bloc-title">
          <q-icon name="mdi-database" />
          <span>Commands</span>
        </div>
        <div class="bloc-content bloc-content-no-padding">
          <device-api :device="resource" />
        </div>
      </div>

    </div>

  </q-page>
</template>

<script>

import DeviceApi from '../components/DeviceApi'
import ResourceQItem from '../components/ResourceQItem'
import ResourceBatteryChip from '../components/ResourceBatteryChip'
import Widget from '../components/Widget'
import ResourceActivity from '../components/ResourceActivity'

export default {
  name: 'PageDevice',

  components: {
    DeviceApi,
    ResourceQItem,
    ResourceBatteryChip,
    Widget,
    ResourceActivity,
  },

  data () {

    return {
      showDetailledAttributes: false,
      widgets: [],
      _resourceId: null,
      isSensor: false,
      staticMeta: {},
      extendsIcons: []
    }
  },

  watch: {
    resource : {
      handler (resource) {
        if (resource && this._resourceId != resource.id()) {
          this.load()
        }
      },
      immediate: true
    }
  },

  methods: {
    load () {
      this._resourceId = this.resource.id()

      this.isSensor = this.$ethingUI.isSubclass(this.resource, 'interfaces/Sensor')

      var w = []
      var staticMeta = this.staticMeta = this.$ethingUI.get(this.resource)
      var widgets = staticMeta.widgets
      for(var id in widgets) {
        var widget = widgets[id]
        if (widget.in.indexOf('devicePage') !== -1) {
          w.push(widget)
        }
      }

      // re order by zIndex
      w.sort(function(a, b) {
          return b.zIndex - a.zIndex;
      });

      this.widgets = w || null

      // extends
      var currentType = this.resource.type()
      var extendsIcons = this.extendsIcons = []
      var types = this.resource.types()
      for (var i in types) {
        var t = types[i]
        if (t==currentType || t=='interfaces/Sensor') continue
        if (t=='resources/Device') break
        var m = this.$ethingUI.getRaw(t)
        if (m && m.icon && extendsIcons.indexOf(m.icon) === -1 && m.icon != staticMeta.icon) {
          extendsIcons.push(m.icon)
        }
      }
    },

    deepChildren (items, resource, filter) {
      this.$ething.arbo.find(r => {
        if (r.createdBy() === resource.id()) {
          if (!filter || filter(r)) {
            if (items.indexOf(r) === -1) {
              items.push(r)
              // the children too
              this.deepChildren(items, r, filter)
            }
          }
        }
      })
    }
  },

  computed: {
    resource () {
      var id = this.$route.params.id
      var r = this.$ething.arbo.get(id)
      if (id && id.length) {
        if (!r) {
          this.$router.replace('/404')
        }
        if (!r.isTypeof('resources/Device')) {
          return
        }
      }
      return r
    },

    meta () {
      return this.$ethingUI.get(this.resource)
    },

    children () {
      return this.$ething.arbo.find(r => {
        return r.createdBy() === this.resource.id()
      })
    },

    activitySource () {
      var items = [this.resource]
      this.deepChildren(items, this.resource, r => r instanceof this.$ething.Device)
      return items
    },

    data () {
      var data = this.resource.data()
      return data && Object.keys(data).length > 0 ? data : undefined
    },

    attributes () {
      var props = this.meta.properties
      var attributes = []
      var skippedFields = ['name', 'data', 'description']
      var detailledFields = ['id', 'modifiedDate', 'createdBy', 'type', 'extends', 'public', 'createdDate', 'methods', 'battery', 'location', 'interfaces', 'connected', 'lastSeenDate', 'error']
      for(let name in props) {
        if (skippedFields.indexOf(name) !== -1) continue

        let prop = props[name]
        let value = prop.getFormatted(this.resource)

        if (!this.showDetailledAttributes && detailledFields.indexOf(name) !== -1) continue

        if (value === null || typeof value === 'undefined') value = '-'

        attributes.push({
          name,
          value
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
    },



  },



}
</script>

<style lang="stylus">


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

.bloc-title
  background-color $primary
  color white
  border-bottom 5px solid #eee
  padding ($space-base / 4) $space-base
  line-height: 2rem
  span
    vertical-align middle
    margin-left $space-base

  /*color $faded
  border-bottom 1px solid $secondary*/
.bloc-content
  &:not(.bloc-content-no-padding)
    padding $space-base

</style>
