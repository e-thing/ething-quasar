<template>
  <modal icon="mdi-pin" ref="modal" :value="value" @input="$emit('input', $event)" title="Pin resource" v-bind="$attrs" size="lg" valid-btn-label="pin" :valid-btn-disable="!resource || optionsError" @valid="done">

    <div class="q-my-md">
      <div class="text-h6 q-my-md">Select the resource to pin</div>
      <div v-if="resources.length">

        <div v-if="resource">

          <div
            class="resource col-xs-12"
          >
            <q-card
              style="height: 100%" flat square
              class="cursor-pointer col-xs-12 col-sm-6 text-white"
              :class="'bg-' + $ethingUI.get(resource).color"
            >
              <q-card-section>
                <div class="row items-center no-wrap">
                  <div class="col">
                    <div class="text-h6 ellipsis">{{ resource.basename() }}</div>
                    <div class="text-subtitle2 ellipsis" v-if="$ething.arbo.get(resource.createdBy())">{{ $ething.arbo.get(resource.createdBy()).basename() }}</div>
                  </div>

                  <div class="col-auto">
                    <q-icon slot="right" :name="$ethingUI.get(resource).icon" color="white"/>
                  </div>
                </div>
              </q-card-section>
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
              dense
              :color="currentFilter == label ? 'primary' : 'faded'"
              :label="label"
              @click="filter(label)"
              class="q-mr-xs"
            />
          </div>

          <div class="row q-col-gutter-xs q-my-sm" v-if="filteredResources.length">
            <div
              class="resource col-xs-12 col-sm-6 col-md-4 col-lg-3 col-xl-2"
              :class="pinned.find(id => id === r.id()) ? 'pinned' : ''"
              v-for="r in filteredResources"
              :key="r.id()"
            >
              <div class="cursor-pointer row items-center q-pa-md"
                style="height: 100%"
                @click="select(r)"
                :class="'bg-' + $ethingUI.get(r).color"
              >
                <div class="col">
                  <div class="ellipsis text-white">{{ r.basename() }}</div>
                  <small v-if="$ething.arbo.get(r.createdBy())" class="ellipsis text-light">{{ $ething.arbo.get(r.createdBy()).basename() }}</small>
                </div>
                <q-icon class="col-auto" style="font-size: 120%;" :name="$ethingUI.get(r).icon" color="white"/>
              </div>
            </div>
          </div>
          <div v-else class="q-my-sm q-mx-md text-faded">
            No resources found !
          </div>
        </div>

      </div>

      <q-banner v-else
        inline-actions
        class="bg-warning text-white q-mb-sm"
      >
        No resource found !
        <template v-slot:action>
          <q-btn flat color="white" label="Add Device" icon="add" @click="$router.push('/devices')" ></q-btn>
        </template>
      </q-banner>
    </div>

    <div v-if="resource">

      <div v-if="Object.keys(widgets).length > 1" class="q-my-md">
        <div class="text-h6 q-my-md">Choose the widget type</div>
        <q-option-group
          color="secondary"
          type="radio"
          v-model="widgetId"
          :options="widgetNames"
        />
      </div>

      <div v-if="widgetOptions" class="q-my-md">
        <div class="text-h6 q-my-md">Options</div>
        <form-schema :key="widgetId" :schema="widgetOptions" v-model="options" @error="optionsError = $event"/>
      </div>

    </div>

  </modal>
</template>

<script>

import Vue from 'vue'
import {extend as extendSchema} from '../utils/schema'
import {dashboardWidgetSchemaDefaults} from '../core/widget'

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
        if (widget.in.indexOf('dashboard') === -1) return
        widgetsMap[k] = widget
      })
      return widgetsMap
    },

    widgetNames () {
      var widgets = this.widgets || {}
      var options = Object.keys(widgets).map(k => {
        var widget = widgets[k]
        var schema = widget.schema
        var label = widget.title || widget.schema.title || widget.schema.label
        var description = widget.description || widget.schema.description

        if (description) {
          label += ' ('+description+')'
        }

        return {
          zIndex: widget.zIndex,
          label,
          value: k
        }
      })

      // re order by zIndex
      options.sort(function(a, b) {
          return b.zIndex - a.zIndex;
      });

      return options
    },

    widgetOptions () {
      return extendSchema(dashboardWidgetSchemaDefaults(this.widgets[this.widgetId], this.resource), this.widgets[this.widgetId].schema)
    },

    resources () {
      return this.$ething.arbo.find((r) => Object.values(this.$ethingUI.get(r).widgets).filter(w => w.in.indexOf('dashboard')!==-1).length)
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
      this.widgetId = this.widgetNames[0].value // default

      if (Object.keys(this.widgets).length === 1 && !this.widgetOptions) {
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


  .resource
    transition all 0.3s ease

  .resource:hover
    opacity 0.7 !important

  .resource.pinned
    opacity 0.4

</style>
