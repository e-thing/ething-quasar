<template>
  <q-item class="item" clickable @click="click" :link="!readonly">
    <div v-for="n in level" :class="gen(n)"></div>
    <q-item-section avatar>
      <q-avatar :icon="meta.icon" text-color="white" :color="meta.color" />
    </q-item-section>
    <q-item-section avatar>
      <q-item-label>
        <span class="vertical-middle text-black">{{ resource.basename() }}</span>
        <small v-if="showParent" class="parent text-faded vertical-bottom on-right" :class="readonly ? '' : 'cursor-pointer'" @click="clickCreatedBy">{{ createdBy.basename() }}</small>
        <q-icon v-if="showConnected && !resource.connected()" class="vertical-middle on-right" name="mdi-lan-disconnect" color="warning" />
        <q-icon v-if="resource.public()" class="vertical-middle on-right" name="share" color="warning" />
      </q-item-label>
      <q-item-label caption v-if="showType" class="text-no-wrap">{{ meta.title }}</q-item-label>
      <template v-if="!dense">
        <q-item-label caption class="text-no-wrap">{{ $ethingUI.utils.dateToString(date, 'never') }}</q-item-label>
        <q-item-label caption v-if="showBattery" class="lt-sm">battery: {{ resource.battery() }}%</q-item-label>
        <q-item-label caption v-if="showLocation" class="lt-sm">location: {{ resource.location() }}</q-item-label>
        <q-item-label caption v-if="showSize">{{ $ethingUI.utils.sizeToString(resource.size()) }}</q-item-label>
        <q-item-label caption v-if="showLength">{{ resource.length() }} rows</q-item-label>
        <q-item-label caption v-if="showError" class="text-negative ellipsis"><q-icon name="mdi-alert" /> {{ resource.attr('error') }}</q-item-label>
      </template>
    </q-item-section>
    <q-item-section/>
    <q-item-section side v-if="!dense">
      <div class="row justify-end">
        <dynamic-component
          :component="badge"
          class="gt-sm"
          v-for="(badge, index) in badges" :key="index"
        />
      </div>
    </q-item-section>
    <q-item-section side v-if="!readonly">
      <div>
        <slot name="buttons-prepend"></slot>

        <q-btn
          v-for="(action, index) in actions" :key="index"
          class="gt-xs"
          :icon="action.icon"
          :label="action.forceLabel ? action.label : null"
          flat
          dense
          :color="action.color || 'secondary'"
          @click.stop="action.click()"
        />

        <q-btn class="gt-xs" icon="delete" round flat dense @click.stop="remove"/>
        <q-btn class="gt-xs" icon="settings" round flat dense @click.stop="openSettings()"/>
        <q-btn class="lt-sm" icon="more_vert" round flat dense @click.stop="more"/>
      </div>
    </q-item-section>
  </q-item>
</template>

<script>

export default {
  name: 'ResourceQItem',

  props: {
    resource: {},
    level: {
      type: Number,
      default: 0
    },
    noParent: Boolean,
    readonly: Boolean,
    dense: Boolean
  },

  data () {
      return {}
  },

  computed: {
    date () {
      if (this.resource instanceof this.$ething.Device) {
        return this.resource.lastSeenDate()
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

    meta () {
      return this.$ethingUI.get(this.resource)
    },

    badges () {
      var badges = Object.values(this.meta.badges)
      // re order by zIndex
      badges.sort(function(a, b) {
          return b.zIndex - a.zIndex;
      });
      return badges
    },

    actions () {
      var actions = Object.values(this.meta.actions())
      // re order by zIndex
      actions.sort(function(a, b) {
          return b.zIndex - a.zIndex;
      });
      return actions
    },

  },

  methods: {

    gen (n) {
      return ['pad', 'pad-'+n]
    },

    openSettings () {
      this.$router.push({
        name: 'resourceEdit',
        params: {
          id: this.resource.id()
        }
      })
    },

    more () {
      var actions = []
      var handlers = {}

      this.actions.forEach((action, index) => {
        var id = 'custom'+index
        actions.push({
          label: action.label,
          color: action.color,
          icon: action.icon,
          id
        })
        handlers[id] = () => {
          return action.click()
        }
      })

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
        return this.openSettings()
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

      if (confirm('Do you really want to remove definitely "' + this.resource.name() + '" ?')) {
        this.resource.remove().then( () => {
          this.$q.notify('"' + name + '" removed !')
        })
      }
    },

    click () {
      if (this.readonly) {
        this.$emit('click', this.resource)
      } else {
        this.$ethingUI.open(this.resource)
      }
    },

    clickCreatedBy (evt) {
      if (!this.readonly) {
        evt.stopPropagation()
        this.$ethingUI.open(this.createdBy)
      }
    },
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
