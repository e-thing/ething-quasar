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

    <div class="items-stretch fit" :class="$q.screen.gt.sm ? 'row' : 'column'">
      <q-tabs
        v-model="widgetType"
        class="col-auto text-teal"
        :vertical="$q.screen.gt.sm"
        align="left"
      >
        <q-tab name="resource" icon="mail" label="Resource" />
        <q-tab name="global" icon="alarm" label="Global" />
      </q-tabs>

      <q-card flat class="col scroll fit">

        <!-- resource select -->
        <q-card-section v-if="widgetType==='resource'">


          <div class="text-h6 q-mb-md">
            <q-icon name="mdi-chevron-double-right"/> Select the resource to pin
            <q-separator/>
          </div>

          <div v-if="resources.length">

            <resource-select v-model="resource" :resources="resourceFilter" filled/>

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

        <q-card-section v-if="widgets && Object.keys(widgets).length > 0">
          <div class="text-h6 q-my-md">
            <q-icon name="mdi-chevron-double-right"/> Choose the widget type
            <q-separator/>
          </div>

          <q-list>
            <q-item tag="label" v-ripple v-for="item in widgetNames" :key="item.value">
              <q-item-section side top>
                <q-radio v-model="widgetId" :val="item.value" />
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ item.label }} <q-icon v-if="item.icon" :name="item.icon"/></q-item-label>
                <q-item-label caption>
                  {{ item.description }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>

        </q-card-section>

        <q-card-section v-if="widgetOptions">
          <div class="text-h6 q-my-md">
            <q-icon name="mdi-chevron-double-right"/> Configure the widget
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

    resourceId () {
      return this.resource ? this.resource.id() : null
    },

    widgets () {
      var widgetsMap = {}
      if (this.widgetType === 'resource') {
        if (!this.resource) return
        var widgets = this.$ethingUI.get(this.resource).widgets || {}
        Object.keys(widgets).map(k => {
          var widget = widgets[k]
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
        var label = widget.title
        var description = widget.description

        return {
          zIndex: widget.zIndex,
          icon: widget.icon,
          label,
          value: k,
          description
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
      return this.$ething.arbo.find((r) => Object.values(this.$ethingUI.get(r).widgets).filter(w => !w.disable).length)
    },

    filteredResources () {
      return this.resources.filter(this.filters[this.currentFilter])
    }

  },

  watch: {
    resourceId (val) {
      if (val) this.widgetId = this.widgetNames[0].value // default
    }
  },

  methods: {

    resourceFilter (r) {
      return this.resources.indexOf(r) !== -1
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

        this.resource = null

        this.$refs.modal.hide()
      }

    },

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
