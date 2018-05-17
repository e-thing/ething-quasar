<template>
  <q-item :to="$ui.route(resource)" class="item">
    <div v-for="n in level" :class="gen(n)"></div>
    <q-item-side :icon="$meta.get(resource).icon" inverted :color="$meta.get(resource).color" />
    <q-item-main>
      <q-item-tile label>
        {{ resource.basename() }}
        <small v-if="showParent" class="parent text-faded cursor-pointer" @click.stop="$ui.open(createdBy)">{{ createdBy.basename() }}</small>
        <q-icon v-if="resource.public()" name="share" color="warning" />
      </q-item-tile>
      <q-item-tile sublabel>{{ $ui.dateToString(date) }}</q-item-tile>
      <q-item-tile sublabel v-if="showType">{{ resource.type() }}</q-item-tile>
      <q-item-tile sublabel v-if="showBattery" class="lt-sm">battery: {{ resource.battery() }}%</q-item-tile>
      <q-item-tile sublabel v-if="showSize">{{ $ui.sizeToString(resource.size()) }}</q-item-tile>
      <q-item-tile sublabel v-if="showLength">{{ resource.length() }} rows</q-item-tile>
    </q-item-main>
    <q-item-side right v-if="showBattery" class="gt-xs">
      <q-chip small detail icon="battery std" >
        {{ resource.battery() }}%
      </q-chip>
    </q-item-side>
    <q-item-side right v-if="showChart" class="gt-xs">
      <q-btn icon="mdi-chart-line" round flat dense color="secondary" @click.stop="chart"/>
    </q-item-side>
    <q-item-side right class="gt-xs">
      <q-btn icon="delete" round flat dense color="negative" @click.stop="remove"/>
    </q-item-side>
    <q-item-side right class="gt-xs">
      <q-btn icon="settings" round flat dense @click.stop="settings"/>
    </q-item-side>
    <q-item-side right class="lt-sm">
      <q-btn icon="more_vert" round flat dense @click.stop="more"/>
    </q-item-side>
  </q-item>
</template>

<script>
import widgets from './widgets'

export default {
  name: 'ResourceQItem',

  props: {
    resource: {},
    level: {
      type: Number,
      default: 0
    },
    noParent: Boolean,
  },

  data () {
      return {}
  },

  computed: {
    date () {
      if (this.resource instanceof this.$ething.Device) {
        return this.resource.lastSeenDate() || this.resource.modifiedDate()
      }
      return this.resource.modifiedDate()
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

    showBattery () {
      return this.resource instanceof this.$ething.Device && this.resource.hasBattery()
    },

    showSize () {
      return this.resource instanceof this.$ething.File
    },

    showLength () {
      return this.resource instanceof this.$ething.Table
    },

    showChart () {
      return this.resource instanceof this.$ething.Table && this.resource.length()
    }

  },

  methods: {

    gen (n) {
      return ['pad', 'pad-'+n]
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
          this.$q.notify(name + ' removed !')
        })
      })
    },

    chart () {
      this.$router.push('/chart/' + this.resource.id())
    },
  }



}
</script>

<style lang="stylus" scoped>
@import '~variables'

.parent:hover
  text-decoration underline

pad-width = 42px
pad-width-xs = 28px
pad-start = 34px
pad-start-xs = 26px

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
