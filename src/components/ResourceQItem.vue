<template>
  <q-item class="item" @click.native="open(resource)" :link="!readonly">
    <div v-for="n in level" :class="gen(n)"></div>
    <q-item-side :icon="meta.icon" inverted :color="meta.color" />
    <q-item-main>
      <q-item-tile label>
        <span class="vertical-middle text-black">{{ resource.basename() }}</span>
        <small v-if="showParent" class="parent text-faded vertical-bottom on-right" :class="readonly ? '' : 'cursor-pointer'" @click.stop="open(createdBy)">{{ createdBy.basename() }}</small>
        <q-icon v-if="showConnected && !resource.connected()" class="vertical-middle on-right" name="mdi-lan-disconnect" color="warning" />
        <q-icon v-if="resource.public()" class="vertical-middle on-right" name="share" color="warning" />
      </q-item-tile>
      <q-item-tile sublabel>{{ $ethingUI.utils.dateToString(date) }}</q-item-tile>
      <q-item-tile sublabel v-if="showType">{{ meta.title }}</q-item-tile>
      <q-item-tile sublabel v-if="showBattery" class="lt-sm">battery: {{ resource.battery() }}%</q-item-tile>
      <q-item-tile sublabel v-if="showLocation" class="lt-sm">location: {{ resource.location() }}</q-item-tile>
      <q-item-tile sublabel v-if="showSize">{{ $ethingUI.utils.sizeToString(resource.size()) }}</q-item-tile>
      <q-item-tile sublabel v-if="showLength">{{ resource.length() }} rows</q-item-tile>
      <q-item-tile sublabel v-if="showError" color="negative"><q-icon name="mdi-alert" /> {{ resource.attr('error') }}</q-item-tile>
    </q-item-main>
    <q-item-side right v-if="Object.keys(data).length>0" class="data gt-sm ellipsis">
      {{ $ethingUI.utils.describe(data) }}
    </q-item-side>
    <q-item-side right v-if="showLocation" class="gt-xs">
      <q-chip small detail icon="location_on">
        {{ resource.location() }}
      </q-chip>
    </q-item-side>
    <q-item-side right v-if="showBattery" class="gt-xs">
      <resource-battery-chip :resource="resource" />
    </q-item-side>
    <template v-if="!readonly">
      <q-item-side right v-if="showChart" class="gt-xs">
        <q-btn icon="mdi-chart-line" round flat dense color="secondary" @click.stop="chart"/>
      </q-item-side>
      <q-item-side right v-if="showDownload" class="gt-xs">
        <q-btn icon="cloud_download" round flat dense color="secondary" @click.stop="download"/>
      </q-item-side>
      <q-item-side right class="gt-xs">
        <q-btn icon="delete" round flat dense @click.stop="remove"/>
      </q-item-side>
      <q-item-side right class="gt-xs">
        <q-btn icon="settings" round flat dense @click.stop="settings"/>
      </q-item-side>
      <q-item-side right class="lt-sm">
        <q-btn icon="more_vert" round flat dense @click.stop="more"/>
      </q-item-side>
    </template>
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
      return this.meta.data()
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

      if (this.showChart) {
        actions.push({
          label: 'Plot chart',
          color: 'secondary',
          icon: 'mdi-chart-line',
          handler: () => {
            return this.chart()
          }
        })
      }

      actions.push({
        label: 'Delete',
        color: 'negative',
        icon: 'delete',
        handler: () => {
          return this.remove()
        }
      })

      actions.push({
        label: 'Settings',
        icon: 'settings',
        handler: () => {
          this.settings()
        }
      })

      this.$q.actionSheet({
        title: this.resource.basename(),
        actions
      }).catch(() => {})
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
      }).then((data) => {
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
          preventClose: true,
          color: 'secondary'
        }).then(format => {
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
@import '~variables'

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
