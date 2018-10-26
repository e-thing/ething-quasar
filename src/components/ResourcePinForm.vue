<template>
  <modal icon="mdi-pin" ref="modal" :value="value" @input="$emit('input', $event)" title="Pin resource" v-bind="$attrs" size="lg" valid-btn-label="pin" :valid-btn-disable="!resource || optionsError" @valid="done">

    <div class="q-my-md">
      <div class="q-title q-my-md">Select the resource to pin</div>
      <div v-if="resources.length">

        <div v-if="resource">

          <div
            class="resource col-xs-12"
          >
            <q-card
              style="height: 100%" flat square
              class="cursor-pointer col-xs-12 col-sm-6"
              :color="$ethingUI.get(resource).color"
              text-color="white"
            >
              <q-card-title>
                <div class="ellipsis">{{ resource.basename() }}</div>
                <div v-if="$ething.arbo.get(resource.createdBy())" class="ellipsis" slot="subtitle">{{ $ething.arbo.get(resource.createdBy()).basename() }}</div>
                <q-icon slot="right" :name="$ethingUI.get(resource).icon" color="white"/>
              </q-card-title>
            </q-card>
          </div>

          <q-btn flat color="faded" label="change" icon="replay" @click="resetList"/>
        </div>

        <div v-else>
          <div>
            <q-btn
              v-for="(filterFn, label) in filters"
              :key="label"
              flat
              :color="currentFilter == label ? 'primary' : 'faded'"
              :label="label"
              @click="filter(label)"
            />
          </div>


          <div class="row gutter-xs q-my-sm" v-if="filteredResources.length">
            <div
              class="resource"
              :class="'col-xs-12 col-sm-6 col-md-4 col-lg-3 ' + (pinned.find(id => id === r.id()) ? 'pinned' : '')"
              v-for="r in filteredResources"
              :key="r.id()"
            >
              <q-card
                @click.native="select(r)"
                style="height: 100%" flat square
                class="cursor-pointer col-xs-12 col-sm-6"
                :color="$ethingUI.get(r).color"
                text-color="white"
              >
                <q-card-title>
                  <div class="ellipsis">{{ r.basename() }}</div>
                  <div v-if="$ething.arbo.get(r.createdBy())" class="ellipsis" slot="subtitle">{{ $ething.arbo.get(r.createdBy()).basename() }}</div>
                  <q-icon slot="right" :name="$ethingUI.get(r).icon" color="white"/>
                </q-card-title>
              </q-card>
            </div>
          </div>
          <div v-else class="q-my-sm q-mx-md text-faded">
            No resources found !
          </div>
        </div>

      </div>

      <q-alert v-else
        type="warning"
        class="q-mb-sm"
        :actions="[
          { label: 'Add Device', icon: 'add', handler: () => { this.$router.push('/devices') } }
        ]"
      >
        No resource found !
      </q-alert>
    </div>

    <div v-if="resource">

      <div v-if="Object.keys(widgets).length > 1" class="q-my-md">
        <div class="q-title q-my-md">Choose the widget type</div>
        <q-option-group
          color="secondary"
          type="radio"
          v-model="widgetId"
          :options="widgetNames"
        />
      </div>

      <div v-if="widgetMetaOptions" class="q-my-md">
        <div class="q-title q-my-md">Options</div>
        <form-schema :schema="widgetMetaOptions" v-model="options" @error="optionsError = $event"/>
      </div>

    </div>

  </modal>
</template>

<script>

import Vue from 'vue'


export default {
  name: 'ResourcePinForm',

  props: ['pinned', 'value'],

  data () {
      return {
        resource: null,
        widgetId: null,
        optionsError: false,
        options: {},
        filters: {
          'devices': (r) => r instanceof this.$ething.Device,
          'tables': (r) => r instanceof this.$ething.Table,
          'files': (r) => r instanceof this.$ething.File,
          'other': (r) => {
            var found = false
            for(var k in this.filters) {
              if (k!=='other') {
                if (this.filters[k](r)) {
                  found = true
                  break
                }
              }
            }
            return !found
          },
        },
        currentFilter: 'devices'
      }
  },

  computed: {

    widgets () {
      if (!this.resource) return
      var widgets = this.$ethingUI.get(this.resource).widgets || {}
      var widgetsMap = {}
      Object.keys(widgets).map(k => {
        var widget = widgets[k]
        if (typeof widget === 'string') {
          widget = this.$ethingUI.findWidget(widget)
        }
        var component = Vue.extend(widget)
        widgetsMap[k] = {
          component,
          metadata: component.options.metadata
        }
      })
      return widgetsMap
    },

    widgetNames () {
      var widgets = this.widgets || {}
      return Object.keys(widgets).map(k => {
        var metadata = widgets[k].metadata
        return {
          label: metadata.label,
          value: k
        }
      })
    },

    widgetMetaOptions () {
      var metadata = this.widgets[this.widgetId].metadata
      if (metadata.options && metadata.options.properties && Object.keys(metadata.options.properties).length>0) {
        if (metadata.options.properties.resource) {
          // remove the resource property
          var copy = extend(true, { type: 'object' }, metadata.options)
          delete copy.properties['resource']
          if (Object.keys(copy.properties).length>0) {
            return copy
          }
        } else {
          return Object.assign({ type: 'object' }, metadata.options)
        }
      }
    },

    resources () {
      return this.$store.getters['ething/filter']((r) => Object.keys(this.$ethingUI.get(r).widgets).length)
    },

    filteredResources () {
      return this.resources.filter(this.filters[this.currentFilter])
    }

  },

  methods: {

    select (resource) {
      this.resource = resource
      this.options = {}
      this.optionsError = false
      this.widgetId = Object.keys(this.widgets)[0] // default

      if (Object.keys(this.widgets).length === 1 && !this.widgetMetaOptions) {
        this.done()
      }
    },

    resetList () {
      this.resource = null
    },

    done () {
      if (this.resource && this.widgetId) {
        this.$emit('done', {
          widgetId: this.widgetId,
          options: Object.assign({
            resource: this.resource.id()
          }, this.options)
        })

        this.resetList()

        this.$refs.modal.hide()
      }
    },

    filter (filterName) {
      if (this.currentFilter !== filterName) {
        this.currentFilter = filterName
        this.resetList()
      }
    }

  }



}
</script>

<style lang="stylus" scoped>
  @import '~variables'

  .resource
    transition all 0.3s ease

  .resource:hover
    opacity 0.7 !important

  .resource.pinned
    opacity 0.4

</style>
