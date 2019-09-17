<template>
  <q-page class="dpage" :style="pageStyle">

    <div v-if="loading">
      <q-inner-loading class="text-center" :showing="loading">
        <div class="q-pa-lg text-primary">loading...</div>
        <q-spinner-oval color="primary" size="50px" />
      </q-inner-loading>
    </div>

    <div v-else-if="currentDashboard" class="page-fit page-fit-no-padding scroll column">

      <q-resize-observer @resize="onPageResize" />

      <q-btn-group flat class="col-auto row items-center">
        <q-btn class="col-auto" flat icon="mdi-chevron-left" :disabled="iDashboard <= 0" @click="iDashboard = iDashboard - 1"/>
        <div class="col text-center">
          <q-btn-dropdown flat :label="currentDashboard.options.title">
            <q-list>
              <q-item v-close-popup clickable @click="pinResourceModal = true">
                <q-item-section avatar>
                  <q-icon name="mdi-pin" />
                </q-item-section>
                <q-item-section>pin widget</q-item-section>
              </q-item>
              <q-item v-close-popup tag="label">
                <q-item-section side top>
                  <q-checkbox v-model="editing" />
                </q-item-section>
                <q-item-section>edit</q-item-section>
              </q-item>
              <q-item v-close-popup clickable @click="editDashboard()">
                <q-item-section avatar>
                  <q-icon name="settings" />
                </q-item-section>
                <q-item-section>settings</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
        <q-btn class="col-auto" flat :icon="iDashboard >= dashboards.length - 1 ? 'mdi-plus' : 'mdi-chevron-right'" @click="nextOrAddDashboard()"/>
      </q-btn-group>

      <keep-alive>
        <div v-if="currentDashboard.items.length==0" class="absolute-center text-center">
          <p>
            <img
              src="~assets/sad.svg"
              style="width:30vw;max-width:150px;"
            >
          </p>
          <p class="text-faded">No widgets</p>
          <q-btn icon="mdi-pin" label="pin widget" color="secondary" @click="pinResourceModal = true"/>
        </div>

        <grid-layout v-else
          class="col scroll"
          :layout.sync="currentDashboard.items"
          :col-num="__columns"
          :row-height="grid.rowHeight"
          :is-draggable="draggable"
          :is-resizable="resizable"
          :vertical-compact="true"
          :margin="[grid.margin, grid.margin]"
          :use-css-transforms="true"
          :key="iDashboard"
          @click.native.self="bgClick"
          v-touch-hold="handleHold"
          @layout-updated="layoutUpdatedEvent"
        >
            <grid-item v-for="(layoutItem) in currentDashboard.items" :key="layoutItem.i"
               :x="layoutItem.x"
               :y="layoutItem.y"
               :w="layoutItem.w"
               :h="layoutItem.h"
               :i="layoutItem.i"
               :minW="layoutItem.minW || 1"
               :minH="layoutItem.minH || 1"
               class="gditem"
            >
                <div v-show="editing" class="absolute fit widget-edit-layer">
                  <q-btn-group flat class="absolute-center" >
                    <q-btn v-if="isEditable(layoutItem)" flat icon="settings" color="faded" @click="editItem(layoutItem)"/>
                    <q-btn flat icon="delete" color="negative" @click="removeItem(layoutItem)"/>
                  </q-btn-group>
                </div>
                <widget :key="layoutItem.key" class="absolute fit"
                  :resource="layoutItem.resource"
                  :widget="layoutItem.widget"
                  v-bind="computeOptions(layoutItem)"
                >
                  <template v-slot:error-after>
                    <q-btn label="remove" size="sm" flat icon="delete" @click="removeItem(layoutItem)"/>
                  </template>
                </widget>
            </grid-item>
        </grid-layout>
      </keep-alive>
    </div>

    <widget-chooser v-model="pinResourceModal" :pinned="pinnedResources" @done="pin"/>

    <modal v-model="widgetEdit.modal" title="Edit" icon="edit" :valid-btn-disable="widgetEdit.error" @valid="widgetEditDone">

      <div class="text-h6 q-my-md">Options</div>
      <form-schema :key="widgetEdit.key" :schema="widgetEdit.schema" v-model="widgetEdit.model" @error="widgetEdit.error = $event"/>

    </modal>

    <modal v-model="dashboardEdit.modal" :title="dashboardEdit.create ? 'New dashboard' : 'Edit dashboard'" icon="edit" :valid-btn-disable="dashboardEdit.error" @valid="dashboardEditDone">

      <div class="text-h6 q-my-md">Options</div>
      <form-schema :key="dashboardEdit.key" :schema="dashboardEdit.schema" v-model="dashboardEdit.model" @error="dashboardEdit.error = $event"/>

    </modal>

  </q-page>
</template>

<script>

import Vue from 'vue'
import EThing from 'ething-js'
import VueGridLayout from 'vue-grid-layout'
import Widget from '../components/Widget'
import { debounce, extend, uid } from 'quasar'
import WidgetChooser from '../components/WidgetChooser'
import {extend as extendSchema} from '../utils/schema'
import {dashboardWidgetSchemaDefaults} from '../core/widget'


var GridLayout = VueGridLayout.GridLayout
var GridItem = VueGridLayout.GridItem

const LAYOUT_FILENAME = ".dashboard.json"

const DBL_CLICK_DELAY  = 200

const LAYOUTS = [{
  columns: 2,
  breakpoint: 0,
},{
  columns: 4,
  breakpoint: 800,
},{
  columns: 8,
  breakpoint: 1400,
}]


export default {
  name: 'PageDashboard',

  components: {
    GridLayout,
    GridItem,
    Widget,
    WidgetChooser
  },

  data () {
    return {
        pageWidth: window.innerWidth,
        loading: false,
        iDashboard: 0,
        dashboards: [],
        grid: {
          rowHeight: 120, // in px
          margin: 10
        },
        pinResourceModal: false,
        editing: false,

        widgetEdit: {
          modal: false,
          item: null,
          schema: {},
          model: {},
          error: false,
          key: 0
        },

        dashboardEdit: {
          modal: false,
          schema: {},
          model: {},
          error: false,
          key: 0,
          create: false
        },

        bgClickTs: 0,
        bgClickTimer: null,
    }
  },

  computed: {
    __columns () {
      var width = this.pageWidth
      var columns = 2
      for (var i in LAYOUTS) {
        var breakpoint = LAYOUTS[i].breakpoint || 0
        if (width < breakpoint) break
        columns = LAYOUTS[i].columns
      }
      return columns
    },
    resizable () {
      return this.editing
    },
    draggable () {
      return this.editing
    },
    pinnedResources () {
      return this.currentDashboard ? this.currentDashboard.items.map(l => l.item.options.resource).filter(r => !!r) : []
    },
    currentDashboard () {
      return this.dashboards[this.iDashboard]
    },
    pageStyle () {
      if (this.currentDashboard) {
        var style = {}
        var options = this.currentDashboard.options

        if (options.backgroundColor) {
    			style['background-color'] = options.backgroundColor
        }

        if (options.backgroundImage) {
          style['background-image'] = 'url('+options.backgroundImage+')'
          style['background-position'] = 'center center'
    			style['background-repeat'] = 'no-repeat'
    			style['background-attachment'] = 'fixed'
    			style['background-size'] = 'cover'
        }

        if (options.widgetsColor) {
          style['color'] = options.widgetsColor
        }

        return style
      }
    },
  },

  watch: {
    __columns: {
      handler (colNb) {
        this.loadLayout(colNb)
      },
      immediate: true
    },
    currentDashboard: {
      handler (dashboard) {
        if (dashboard) this.loadLayout(null, dashboard)
      },
      immediate: true
    },
  },

  methods: {
    layoutUpdatedEvent: function(newLayout){
      if (!this.editing) return
      this.saveLayout()
      this.save()
    },

    loadLayout (colNb, dashboard) {
      colNb = colNb || this.__columns
      dashboard = dashboard || this.currentDashboard
      if (!dashboard) return
      var layouts = dashboard.layouts || {}
      var layout = layouts[colNb] || []
      dashboard.items.forEach(item => {
        var layoutItem = this.findItemInLayout(layout, item.i)
        if (!layoutItem) {
          // try to find in any other layout
          for (var i in layouts) {
            layoutItem = this.findItemInLayout(layouts[i], item.i)
            if (layoutItem) break
          }
          if (!layoutItem) {
            // default
            layoutItem = {
              x: 0,
              y: 0,
              w: 1,
              h: 1
            }
          }
        }
        Object.assign(item, layoutItem)
      })
    },

    saveLayout (colNb, dashboard) {
      colNb = colNb || this.__columns
      dashboard = dashboard || this.currentDashboard
      if (!dashboard) return
      dashboard.layouts[this.__columns] = dashboard.items.map(layoutItem => {
        return {
          i: layoutItem.i,
          x: layoutItem.x,
          y: layoutItem.y,
          w: layoutItem.w,
          h: layoutItem.h,
        }
      })
    },

    handleHold ({ evt, ...info }) {
      this.editing = !this.editing
    },

    bgClick (evt) {
      var ts = Date.now()

      /*if (! evt.srcElement.classList.contains('vue-grid-layout')) {
        // only background click
        return
      }*/

      if (ts - this.bgClickTs < DBL_CLICK_DELAY) {
        // double click
        clearTimeout(this.bgClickTimer)
        //console.log('BG DBL CLICK', evt)

        this.pinResourceModal = true

      } else {
        // 1 click ?
        this.bgClickTimer = setTimeout(() => {
          // yes 1 click
          //console.log('BG CLICK', evt)

          if (this.editing) {
            this.editing = !this.editing
          }

        }, DBL_CLICK_DELAY + 10)

        this.bgClickTs = ts
      }

    },

    nextOrAddDashboard () {
      if (this.iDashboard >= this.dashboards.length - 1) {
        this.editDashboard(true)
      } else {
        this.iDashboard = this.iDashboard + 1
      }
    },

    editDashboard (create) {
      var schema = {
        properties: {
          title: {
            type: 'string',
            default: 'dashboard #' + this.dashboards.length
          },
          backgroundColor: {
            title: 'background color',
            type: 'string',
            '$component': 'color',
            description: 'The color of the dashboard\'s background',
            default: '#f5f5f5'
          },
          backgroundImage: {
            title: 'background image',
            type: 'string',
            description: 'url of the background image.'
          },
          widgetsColor: {
            title: 'widget color',
            type: 'string',
            '$component': 'color',
            description: 'The default color of the widget',
            default: '#027be3'
          },
          widgetsBackgroundColor: {
            title: 'widget background color',
            type: 'string',
            '$format': 'hexa',
            '$component': 'color',
            description: 'The default color of the widget\'s background',
            default: '#ffffffff'
          },
        },
        required: ['title']
      }

      var model = create ? {} : this.currentDashboard.options

      this.dashboardEdit.key++
      this.dashboardEdit.schema = schema
      this.dashboardEdit.model = extend(true, {}, model)
      this.dashboardEdit.error = false
      this.dashboardEdit.modal = true
      this.dashboardEdit.create = !!create
    },

    dashboardEditDone () {
      if (!this.currentDashboard.error) {

        if (this.dashboardEdit.create) {
          this.dashboards.push({
            options: this.dashboardEdit.model,
            items: [],
            layouts: {}
          })
          this.iDashboard++
        } else {
          this.$set(this.currentDashboard, 'options', this.dashboardEdit.model)
        }

        this.dashboardEdit.modal = false

        this.save()
      }
    },

    file (callback) {
      var files = this.$ething.arbo.glob(LAYOUT_FILENAME).filter(r => r instanceof this.$ething.File)
      var file = null

      if (files.length) {
        file = files[0]
      }

      if (typeof callback === 'function'){
        if (!file) {
          // create the file if not found !
          this.$ething.File.create({
  					name: LAYOUT_FILENAME
  				}).then( (file) => {
  					callback(file)
  				})
        } else {
          callback(file)
        }
      } else {
        return file
      }

    },

    initDashboard (dashboards) {
      dashboards = dashboards || []

      if (dashboards.length == 0) {
        dashboards.push({})
      }

      dashboards = dashboards.map((d, i) => {
        return {
          options: extend(true, {
              title: 'dashboard #' + i,
            }, d.options || {}),
          items: (d.widgets || []).map(l => this.normalizeLayoutItem(l)).filter(l => !!l),
          layouts: d.layouts || {}
        }
      })

      this.dashboards = dashboards


    },

    load: function() {
      this.loading = true

      var file = this.file()

      if (file) {
        file.read().then( (config) => {

          if(typeof config == 'string') {
						try{
							config = JSON.parse(config);
						}
						catch(e){
              config = {}
            }
          }

          if (typeof config.widgets != 'undefined') {
            config = {
              dashboards: [config]
            }
          }

          this.initDashboard(config.dashboards)

        }).catch(err => {
          this.initDashboard()
        }).finally(() => {
          this.loading = false
        })
      } else {
        this.initDashboard()
        this.loading = false
      }

    },

    normalizeLayoutItem (item) {

      try {
        var widget = null;
        var resource = null;

        if (typeof item.widgetId !== 'undefined') {
          resource = this.$ething.arbo.get(item.options.resource)
          var resourceMeta = this.$ethingUI.get(resource)
          widget = resourceMeta.widgets[item.widgetId]
          if (!widget) {
            console.error('[dashboard] widget "' + item.widgetId + '" not found for the resource ' + resource.name())
            return
          }
        } else {
          widget = this.$ethingUI.findWidget(item.widgetType)
          if (!widget) {
            console.error('[dashboard] unknown widget type: ' + item.widgetType)
            return
          }
        }

        var minWidth = 1
        var minHeight = 1
        /*if (widget.minWidth) {
          var columnNb = dashboardOptions.columnNb
          var widthUnit = Math.floor(this.grid.minWidth / columnNb)
          minWidth = Math.max(Math.min(Math.round(widget.minWidth / widthUnit), columnNb), 1)
        }
        if (widget.minHeight) {
          minHeight = Math.max(Math.round(widget.minHeight / this.grid.rowHeight), 1)
        }*/

        /*if (!item.w || item.w<minWidth) item.w = minWidth
        if (!item.h || item.h<minHeight) item.h = minHeight

        if (!item.x) item.x = 0
        if (!item.y) item.y = 0*/
        if (!item.options) item.options = {}
        if (!item.i) item.i = uid()

        var layoutItem = {
          key: 0,
          widget,
          item,
          resource,
          minW: minWidth,
          minH: minHeight,
          i: item.i,
          x: 0,
          y: 0,
          w: 1,
          h: 1
        }

        return layoutItem
      } catch(err) {
        console.error('unable to load a widget item:', item, err)
      }
    },

    computeOptions (layoutItem) {
      var options = extend(true, {}, layoutItem.item.options)

      if (!options.bgColor) {
        options.bgColor = this.currentDashboard.options.widgetsBackgroundColor
      }
      if (!options.color) {
        options.color = this.currentDashboard.options.widgetsColor
      }

      return options
    },

    save: debounce( function(){
      this.file( file => {

        var dashboards = this.dashboards.map(d => {
          return {
            options: d.options,
            widgets: d.items.map(layoutItem => layoutItem.item),
            layouts: d.layouts
          }
        })

        file.write( JSON.stringify({
          dashboards
        }, null, 4) )
      })
    }, 500),

    addWidget (attr) {
      var l  = this.normalizeLayoutItem(attr)
      if (l)
        this.currentDashboard.items.push(l)
    },

    pin (info) {
      this.addWidget(info)
      this.save()
      this.pinResourceModal = false
    },

    isEditable (layoutItem) {
      return true
    },

    editItem (layoutItem) {
      var schema = extendSchema(dashboardWidgetSchemaDefaults(layoutItem.widget, layoutItem.resource), layoutItem.widget.schema)

      this.widgetEdit.key++
      this.widgetEdit.layoutItem = layoutItem
      this.widgetEdit.schema = schema
      this.widgetEdit.model = extend(true, {}, layoutItem.item.options)
      this.widgetEdit.error = false
      this.widgetEdit.modal = true
    },

    widgetEditDone () {
      if (!this.widgetEdit.error) {
        var resource = this.widgetEdit.layoutItem.item.options.resource;
        var options = this.widgetEdit.model

        if (resource) {
          options = Object.assign({resource}, options)
        }

        this.$set(this.widgetEdit.layoutItem.item, 'options', options)

        this.widgetEdit.layoutItem.key++

        this.widgetEdit.modal = false

        this.save()
      }
    },

    removeItem (layoutItem) {
      var index = this.currentDashboard.items.indexOf(layoutItem)
      if (index !== -1) {
        this.currentDashboard.items.splice(index, 1)
        this.save()
      }
    },

    onPageResize (size) {
      this.pageWidth = size.width
    },

    findItemInLayout (layout, i) {
      for (var j in layout) {
        if (layout[j].i === i) {
          return layout[j]
        }
      }
    }

  },

  mounted () {
    this.load()
  }

}
</script>

<style lang="stylus" scoped>


.dpage {
  background-color: #f5f5f5;
}

/* Cf. https://github.com/taye/interact.js/issues/580 */
.gditem {
  -ms-touch-action: none;
      touch-action: none;
}

.vue-grid-item {
    /*border: 1px solid #f4f4f4;*/
}

.widget-edit-layer {
  z-index: 3;
  background-color: rgba(255, 255, 255, 0.84);
}

.widget-overflow-layer {
  z-index: 2;
  color: white;
  background-color: $orange-5;
  opacity: 0.6;
  font-size: small;
  text-align: center;
}

</style>

<style>
.vue-resizable-handle {
  height: 0 !important;
  width: 0 !important;
  border-bottom: 40px solid #777777;
  border-left: 40px solid transparent;
  padding: 0 !important;
  z-index: 5 !important;
}
</style>
