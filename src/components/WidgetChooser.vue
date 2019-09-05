<template>
  <modal
    icon="mdi-pin"
    ref="modal"
    :value="value"
    @input="$emit('input', $event)"
    title="Pin resource"
    v-bind="$attrs"
    size="lg"
    valid-btn-label="pin"
    :valid-btn-disable="!selectedWidget || optionsError"
    @valid="done"
    no-content-padding
  >

    <div class="row items-stretch">
      <q-tabs
        v-model="widgetType"
        class="col-auto text-teal"
        vertical
      >
        <q-tab name="resource" icon="mail" label="Resource" />
        <q-tab name="global" icon="alarm" label="Global" />
      </q-tabs>

      <q-card flat class="col">

        <!-- resource select -->
        <q-card-section v-if="widgetType==='resource'">


          <div class="text-h6 q-mb-md">
            Select the resource to pin
            <q-separator/>
          </div>

          <div v-if="resources.length">

            <resource-select v-model="resource" :filter="resourceFilter" borderless/>

          </div>

          <q-banner v-else
            inline-actions
            class="bg-warning text-white"
          >
            No resource found !
            <template v-slot:action>
              <q-btn flat color="white" label="Add Device" icon="add" @click="$router.push('/devices')" ></q-btn>
            </template>
          </q-banner>
        </q-card-section>


        <q-card-section v-if="widgets && Object.keys(widgets).length > 1">
          <div class="text-h6 q-mb-md">
            Choose the widget type
            <q-separator/>
          </div>

          <q-option-group
            color="secondary"
            type="radio"
            v-model="widgetId"
            :options="widgetNames"
          />
        </q-card-section>

        <q-card-section v-if="widgetOptions">
          <div class="text-h6 q-mb-md">
            Options
            <q-separator/>
          </div>

          <form-schema :key="widgetId" :schema="widgetOptions" v-model="options" @error="optionsError = $event"/>
        </q-card-section>

      </q-card>

    </div>

  </modal>
</template>

<script>

import Vue from 'vue'
import {extend as extendSchema} from '../utils/schema'
import {dashboardWidgetSchemaDefaults} from '../core/widget'
import ResourceList from '../components/ResourceList'
import ResourceSelect from '../components/ResourceSelect'


export default {
  name: 'WidgetChooser',

  components: {
    ResourceList,
    ResourceSelect
  },

  props: ['pinned', 'value'],

  data () {
      return {
        widgetType: 'resource',
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
      var widgetsMap = {}
      if (this.widgetType === 'resource') {
        if (!this.resource) return
        var widgets = this.$ethingUI.get(this.resource).widgets || {}
        Object.keys(widgets).map(k => {
          var widget = widgets[k]
          if (widget.in.indexOf('dashboard') === -1) return
          widgetsMap[k] = widget
        })
        return widgetsMap
      } else {
        // global widgets
        for (var id in this.$ethingUI.widgets) {
          var w = this.$ethingUI.widgets[id]
          widgetsMap[id] = w
        }
        return widgetsMap
      }
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

    selectedWidget () {
      if (!this.widgets) return
      return this.widgets[this.widgetId]
    },

    widgetOptions () {
      if (!this.selectedWidget) return
      return extendSchema(dashboardWidgetSchemaDefaults(this.selectedWidget, this.resource), this.selectedWidget.schema)
    },

    resources () {
      return this.$ething.arbo.find((r) => Object.values(this.$ethingUI.get(r).widgets).filter(w => w.in.indexOf('dashboard')!==-1).length)
    },

    filteredResources () {
      return this.resources.filter(this.filters[this.currentFilter])
    }

  },

  methods: {

    resourceFilter (r) {
      return this.resources.indexOf(r) !== -1
    },

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
      if (this.selectedWidget) {

        if (this.resource) {
          this.$emit('done', {
            widgetId: this.widgetId,
            options: Object.assign({
              resource: this.resource.id()
            }, this.options)
          })
        } else {
          this.$emit('done', {
            widgetType: this.widgetId,
            options: Object.assign({}, this.options)
          })
        }

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

  .left-menu
    border-right: 1px solid $secondary

  .resource
    transition all 0.3s ease

  .resource:hover
    opacity 0.7 !important

  .resource.pinned
    opacity 0.4

</style>