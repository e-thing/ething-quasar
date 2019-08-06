<template>
  <q-item class="item" clickable @click="open(resource)" :link="!readonly">
    <div v-for="n in level" :class="gen(n)"></div>
    <q-item-section avatar>
      <q-avatar :icon="meta.icon" text-color="white" :color="meta.color" />
    </q-item-section>
    <q-item-section>
      <q-item-label>
        <span class="vertical-middle text-black">{{ resource.basename() }}</span>
        <small v-if="showParent" class="parent text-faded vertical-bottom on-right" :class="readonly ? '' : 'cursor-pointer'" @click.stop="open(createdBy)">{{ createdBy.basename() }}</small>
        <q-icon v-if="showConnected && !resource.connected()" class="vertical-middle on-right" name="mdi-lan-disconnect" color="warning" />
        <q-icon v-if="resource.public()" class="vertical-middle on-right" name="share" color="warning" />
      </q-item-label>
      <q-item-label caption>{{ $ethingUI.utils.dateToString(date) }}</q-item-label>
      <q-item-label caption v-if="showType">{{ meta.title }}</q-item-label>
      <q-item-label caption v-if="showBattery" class="lt-sm">battery: {{ resource.battery() }}%</q-item-label>
      <q-item-label caption v-if="showLocation" class="lt-sm">location: {{ resource.location() }}</q-item-label>
      <q-item-label caption v-if="showSize">{{ $ethingUI.utils.sizeToString(resource.size()) }}</q-item-label>
      <q-item-label caption v-if="showLength">{{ resource.length() }} rows</q-item-label>
      <q-item-label caption v-if="showError" color="negative"><q-icon name="mdi-alert" /> {{ resource.attr('error') }}</q-item-label>
    </q-item-section>
    <!--<q-item-section side v-if="Object.keys(data).length>0" class="data gt-sm ellipsis">
      {{ $ethingUI.utils.describe(data) }}
    </q-item-section>-->
    <q-item-section side>
      <div>
        <q-chip dense class="gt-sm" outline square color="secondary" v-for="(value, key) in data" :key="key">{{ key }}: {{ value }}</q-chip>
        <q-chip v-if="showLocation" dense outline square color="secondary" icon="location_on" class="gt-xs">
          {{ resource.location() }}
        </q-chip>
        <resource-battery-chip outline square color="secondary" v-if="showBattery" class="gt-xs" :resource="resource" />
      </div>
    </q-item-section>
    <!--<q-item-section side v-if="showLocation" class="gt-xs">
      <q-chip dense icon="location_on">
        {{ resource.location() }}
      </q-chip>
    </q-item-section>-->
    <!--<q-item-section side v-if="showBattery" class="gt-xs">
      <resource-battery-chip :resource="resource" />
    </q-item-section>-->
    <q-item-section side v-if="!readonly">
      <div>
        <q-btn v-if="showChart" class="gt-xs" icon="mdi-chart-line" round flat dense color="secondary" @click.stop="chart"/>
        <q-btn v-if="showDownload" class="gt-xs" icon="cloud_download" round flat dense color="secondary" @click.stop="download"/>
        <q-btn class="gt-xs" icon="delete" round flat dense @click.stop="remove"/>
        <q-btn class="gt-xs" icon="settings" round flat dense @click.stop="settings"/>
        <q-btn class="lt-sm" icon="more_vert" round flat dense @click.stop="more"/>
      </div>
    </q-item-section>
  </q-item>
</template>

<script>
import ResourceBatteryChip from './ResourceBatteryChip'

export default {
  name: 'ResourceQItem',

  components: {
    ResourceBatteryChip
  },

  props: {
    resource: {},
    level: {
      type: Number,
      default: 0
    },
    noParent: Boolean,
    readonly: Boolean
  },

  data () {
      return {}
  },

  computed: {
    date () {
      var modifiedDate = this.resource.modifiedDate()
      if (this.resource instanceof this.$ething.Device) {
        var lastSeenDate = this.resource.lastSeenDate()
        if (lastSeenDate && lastSeenDate > modifiedDate) return lastSeenDate
      }
      return modifiedDate
    },

    createdBy () {
      return this.resource.createdBy() ? this.$ething.arbo.get(this.resource.createdBy()) : null
    },

    showParent () {
      return !this.noParent && !!this.createdBy
    },

    showType () {
      return this.resource instanceof this.$ething.Device
    },

    showConnected () {
      return this.resource instanceof this.$ething.Device
    },

    showError () {
      return this.resource instanceof this.$ething.Device && this.resource.attr('error')
    },

    showBattery () {
      return this.resource instanceof this.$ething.Device && this.resource.hasBattery()
    },

    showLocation () {
      return this.resource instanceof this.$ething.Device && this.resource.location()
    },

    showSize () {
      return this.resource instanceof this.$ething.File
    },

    showLength () {
      return this.resource instanceof this.$ething.Table
    },

    showChart () {
      return this.resource instanceof this.$ething.Table && this.resource.length()
    },

    showDownload () {
      return this.resource instanceof this.$ething.File || this.resource instanceof this.$ething.Table
    },

    meta () {
      return this.$ethingUI.get(this.resource)
    },

    data () {
      return this.meta.data() || {}
    }

  },

  methods: {

    gen (n) {
      return ['pad', 'pad-'+n]
    },

    batteryIcon (level) {
      if (level > 95) return 'mdi-battery'
      if (level > 85) return 'mdi-battery-90'
      if (level > 75) return 'mdi-battery-80'
      if (level > 65) return 'mdi-battery-70'
      if (level > 55) return 'mdi-battery-60'
      if (level > 45) return 'mdi-battery-50'
      if (level > 35) return 'mdi-battery-40'
      if (level > 25) return 'mdi-battery-30'
      if (level > 15) return 'mdi-battery-20'
      if (level >= 0) return 'mdi-battery-alert'
      return 'battery unknown'
    },

    batteryColor (level) {
      if (level <= 15) return 'negative'
      if (level <= 40) return 'warning'
    },

    settings () {
      this.$router.push('/resource/' + this.resource.id())
    },

    more () {
      var actions = []
      var handlers = {}

      if (this.showChart) {
        actions.push({
          label: 'Plot chart',
          color: 'secondary',
          icon: 'mdi-chart-line',
          id: 'plotChart'
        })
        handlers['plotChart'] = () => {
          return this.chart()
        }
      }

      actions.push({
        label: 'Delete',
        color: 'negative',
        icon: 'delete',
        id: 'remove'
      })
      handlers['remove'] = () => {
        return this.remove()
      }

      actions.push({
        label: 'Settings',
        icon: 'settings',
        id: 'settings'
      })
      handlers['settings'] = () => {
        return this.settings()
      }

      this.$q.bottomSheet({
        title: this.resource.basename(),
        actions
      }).onOk(action => {
        handlers[actions]()
      })
    },

    remove () {
      var name = this.resource.name()

      var children = this.$ething.arbo.list().filter(r => {
        return r.createdBy() === this.resource.id()
      })

      var items = []

      if (children.length) {
        items.push({label: 'Remove also the children resources', value: 'removeChildren', color: 'secondary'})
      }

      return this.$q.dialog({
        title: 'Remove',
        message: 'Do you really want to remove definitely the ' + this.resource.type() + ' "' + this.resource.name() + '" ?',
        options: {
          type: 'checkbox',
          model: [],
          items
        },
        ok: 'Remove',
        cancel: 'Cancel'
      }).onOk((data) => {
        this.resource.remove(data.indexOf('removeChildren') !== -1).then( () => {
          this.$q.notify('"' + name + '" removed !')
        })
      })
    },

    chart () {
      this.$router.push('/chart/' + this.resource.id())
    },

    download () {
      if (this.resource instanceof this.$ething.File) {
        this.$ething.request({
          url: this.resource.getContentUrl(),
          dataType: 'blob'
        }).then((data) => {
          this.$ethingUI.utils.saveAs(data, this.resource.basename())
        })
      } else if (this.resource instanceof this.$ething.Table) {

        this.$q.dialog({
          title: 'Download "' + this.resource.name() + '"',
          message: 'Format: ',
          options: {
            type: 'radio',
            model: 'csv',
            items: [
              {label: 'CSV', value: 'csv'},
              {label: 'JSON', value: 'json_pretty'}
            ]
          },
          cancel: true,
          persistent: true,
          color: 'secondary'
        }).onOk(format => {
          this.$ething.request({
            url: this.resource.getContentUrl() + '?fmt=' + format,
            dataType: 'blob'
          }).then((data) => {
            this.$ethingUI.utils.saveAs(data, this.resource.basename() + '.' + (format=='json_pretty' ? 'json' : format))
          })
        })
      }
    },

    open (r) {
      if (!this.readonly) this.$ethingUI.open(r)
    }
  }



}
</script>

<style lang="stylus" scoped>


.data
  max-width 500px

@media (max-width: $breakpoint-md)
  .data
    max-width 250px

.parent:hover
  text-decoration underline

pad-width = 42px
pad-width-xs = 28px
pad-start = 34px
pad-start-xs = 26px

.item
  &:hover
    background-color #027be30f !important

@media (max-width: $breakpoint-xs)
  .item
    padding-left 8px
    padding-right 8px

.pad:before
    content ''
    position absolute
    right auto

.pad:before
    border-left 2px solid $purple-2
    bottom 0px
    top -0px
    width 1px

.pad
  width pad-width
  @media (max-width: $breakpoint-xs)
    width pad-width-xs

.pad-1:before
  left pad-start
  @media (max-width: $breakpoint-xs)
    left pad-start-xs

.pad-2:before
  left pad-start + 1 * pad-width
  @media (max-width: $breakpoint-xs)
    left pad-start-xs + 1 * pad-width-xs

.pad-3:before
  left pad-start + 2 * pad-width
  @media (max-width: $breakpoint-xs)
    left pad-start-xs + 2 * pad-width-xs

.pad-4:before
  left pad-start + 3 * pad-width
  @media (max-width: $breakpoint-xs)
    left pad-start-xs + 3 * pad-width-xs

</style>
