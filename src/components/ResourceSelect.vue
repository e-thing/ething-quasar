<template>
  <q-select
   v-model="model"
   :options="options"
   :multiple="multiple"
   v-bind="$attrs"
   :use-input="enableFilter"
   @filter="filterFn"
   :input-debounce="search_ ? 300 : 0"
   items-aligned
   options-selected-class="text-deep-orange"
   :virtual-scroll-slice-size="200"
   :placeholder="selectedResources.length ? 'search for a resource...' : 'Select a resource'"
   :display-value="selectedResources.length ? '...' : 'Select a resource'"
  >
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey">
          No resources available
        </q-item-section>
      </q-item>
    </template>

    <template v-slot:selected-item="scope" v-if="selectedResources.length">
      <q-chip
        removable
        dense
        @remove="scope.removeAtIndex(scope.index)"
        :tabindex="scope.tabindex"
        :color="scope.opt.color"
        text-color="white"
        class="q-ml-none q-my-xs q-mr-xs"
        :icon="scope.opt.icon"
        :label="scope.opt.label"
      />
    </template>

    <template v-slot:option="scope">
      <q-item-label
        v-if="scope.opt.header"
        header
        v-show="scope.opt.resourcesLength>0"
      >{{ scope.opt.label }} ({{ scope.opt.resourcesLength }})</q-item-label>
      <q-item
        v-else
        v-bind="scope.itemProps"
        v-on="scope.itemEvents"
        v-show="!scope.opt.hide"
      >
        <q-item-section avatar>
          <q-avatar :color="scope.opt.color" text-color="white" :icon="scope.opt.icon" />
        </q-item-section>
        <q-item-section>
          <q-item-label>
            <span>{{ scope.opt.label }}</span>
            <small v-if="scope.opt.createdBy" class="text-faded q-ml-sm">{{ scope.opt.createdBy.basename() }}</small>
            <q-icon v-if="scope.opt.isDevice && !scope.opt.resource.connected()" class="vertical-middle on-right" name="mdi-lan-disconnect" color="warning" />
            <q-icon v-if="scope.opt.isDevice && scope.opt.resource.attr('error')" class="vertical-middle on-right" name="mdi-alert" color="negative" />
          </q-item-label>
          <q-item-label caption>{{ scope.opt.title }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>

    <template v-slot:append v-if="!disableCreate && __createTypes.length!=0">
      <q-icon name="add" class="cursor-pointer" @click.prevent.stop="showCreatePopup_=true" />
      <resource-create-modal :types="__createTypes" v-model="showCreatePopup_"/>
    </template>
  </q-select>
</template>

<script>
import ResourceListBase from './ResourceListBase'

export default {
  name: 'ResourceSelect',

  mixins: [ResourceListBase],

  props: {
    value: {},
    useId: Boolean,
    multiple: Boolean,
    createTypes: Array,
    enableFilter: Boolean,
    disableCreate: Boolean
  },

  data () {
    return {
      options: [],
      showCreatePopup_: false,
      search__: ''
    }
  },

  computed: {

    model: {
      get: function () {
        var mids = []
        this.selectedResources.forEach(r => {
          for (var i in this.options) {
            if (this.options[i].value === r.id()) {
              mids.push(this.options[i])
            }
          }
        })
        return this.multiple ? mids : mids[0]
      },
      set: function (val) {
        var m
        if (!val) {
          m = this.multiple ? [] : null
        } else {
          if (this.multiple) {
            m = this.useId ? val.map(opt => opt.value) : val.map(opt => opt.resource)
          } else {
            m = this.useId ? val.value : val.resource
          }
        }
        this.$emit('input', m)
      }
    },

    selectedResources () {
      if (this.multiple) {
        var v = []
        if (Array.isArray(this.value)) {
          v = this.value
        } else if (this.value) {
          v = [this.value]
        }

        return this.useId ? v.map(id => {
          return this.$ething.arbo.get(id)
        }) : v
      } else if (this.value) {
        return [this.useId ? this.$ething.arbo.get(this.value) : this.value]
      } else {
        return []
      }
    }
  },

  methods: {

    compute_options () {
      var searchFilter = this.__makeSearchFilter(this.search__)
      var options = []

      var resourceProcess = r => {
        var meta = this.$ethingUI.get(r)
        var createdBy = r.createdBy()
        if (createdBy) {
          createdBy = this.$ething.arbo.get(createdBy)
        }

        options.push({
          label: r.name(),
          value: r.id(),
          icon: meta.icon,
          color: meta.color,
          title: meta.title,
          createdBy,
          resource: r,
          isDevice: r instanceof this.$ething.Device,
          hide: !searchFilter(r)
        })
      }

      if (this.__groups.length) {
        this.__groups.forEach(group => {
          if (group.resources.length === 0) return

          // header
          options.push({
            label: group.label,
            icon: group.icon,
            disable: true,
            header: true,
            resourcesLength: group.resources.length
          })

          group.resources.forEach(resourceProcess)
        })
      } else {
        this.__filteredResources.forEach(resourceProcess)
      }

      return options
    },

    filterFn (val, update, abort) {
      this.search__ = val
      update(() => {
        this.options = this.compute_options()
      })
    }

  },

  created () {
    this.options = this.compute_options()
  }

}
</script>
