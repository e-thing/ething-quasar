<template>
  <q-page class="dpage" :style="pageStyle">

    <div v-if="loading">
      <q-inner-loading class="text-center" :showing="loading">
        <div class="q-pa-lg text-primary">loading...</div>
        <q-spinner-oval color="primary" size="50px" />
      </q-inner-loading>
    </div>

    <div v-else-if="currentDashboard" class="absolute fit column">

      <q-resize-observer @resize="onPageResize" />

      <q-btn-group flat class="col-auto row items-center full-width" v-show="!editing">
        <q-btn size="lg" class="col-auto" flat icon="mdi-chevron-left" :style="iDashboard <= 0 ? 'visibility: hidden' : ''" @click="iDashboard = iDashboard - 1"/>
        <div class="col text-center ellipsis">
          <q-btn-dropdown flat :label="currentDashboard.options.title" size="lg">
            <q-list class="text-faded">
              <q-item v-close-popup clickable @click="iDashboard = index" v-for="(dashboard, index) in dashboards" :key="index">
                <q-item-section>{{ dashboard.options.title }}</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
        <q-btn stretch class="col-auto" flat :icon="editing ? 'mdi-cancel' : 'mdi-pencil'" :label="editing ? 'cancel' : ''" v-show="!editing" @click="editing = !editing"/>
        <q-btn size="lg" class="col-auto" flat :icon="iDashboard >= dashboards.length - 1 ? 'mdi-plus' : 'mdi-chevron-right'" @click="nextOrAddDashboard()"/>
      </q-btn-group>

      <div flat class="col-auto row items-center bg-secondary" v-show="editing" style="height: 51px;">
        <q-btn flat stretch icon="add" color="white" @click="pinResourceModal = true"/>
        <q-btn flat stretch icon="delete" color="white" @click="removeDashboard()"/>
        <q-btn flat stretch icon="mdi-settings" color="white" @click="editDashboard()"/>
        <q-space/>
        <q-btn flat stretch color="white" label="cancel" @click="editing = false"/>
      </div>

      <div class="col relative-position" v-if="currentDashboard.items.length==0">
        <div class="absolute-center text-center">
          <p>
            <q-icon name="error_outline" color="secondary" style="font-size: 6em;" />
          </p>
          <p class="text-faded">No widgets</p>
          <q-btn icon="mdi-pin" label="pin widget" color="secondary" @click="pinResourceModal = true"/>
        </div>
      </div>

      <q-scroll-area
        class="col relative-position"
        v-else
        @click.native="bgClick"
        v-touch-hold.mouse="handleHold"
      >

        <grid-layout
          v-for="cacheItem in cache" :key="cacheItem.id"
          v-show="currentDashboard.id === cacheItem.dashboard.id"
          :layout.sync="cacheItem.dashboard.items"
          :col-num="__columns"
          :row-height="grid.rowHeight"
          :is-draggable="draggable"
          :is-resizable="resizable"
          :vertical-compact="false"
          prevent-collision
          :margin="[grid.margin, grid.margin]"
          :use-css-transforms="true"
          @layout-updated="layoutUpdatedEvent"
        >
            <grid-item v-for="(layoutItem) in cacheItem.dashboard.items" :key="layoutItem.i"
               :x="layoutItem.x"
               :y="layoutItem.y"
               :w="layoutItem.w"
               :h="layoutItem.h"
               :i="layoutItem.i"
               :minW="layoutItem.minW || 1"
               :minH="layoutItem.minH || 1"
               class="gditem"
               drag-ignore-from="button"
               drag-allow-from=".dragger"
               @touchstart.stop @mousedown.stop @click.native.stop
            >
                <div v-show="editing" class="absolute fit widget-edit-layer">
                  <q-btn-group flat class="absolute-center" >
                    <q-btn class="dragger" flat icon="mdi-cursor-move" color="faded" type="a"/>
                    <q-btn v-if="isEditable(cacheItem.dashboard, layoutItem)" flat icon="settings" color="faded" @click="editItem(cacheItem.dashboard, layoutItem)"/>
                    <q-btn flat icon="delete" color="negative" @click="removeWidget(cacheItem.dashboard, layoutItem)"/>
                  </q-btn-group>
                </div>
                <widget :key="layoutItem.key" class="absolute fit"
                  :resource="layoutItem.resource"
                  :widget="layoutItem.widget"
                  v-bind="computeOptions(cacheItem.dashboard, layoutItem)"
                  enable-title-click
                >
                  <template v-slot:error-after>
                    <q-btn label="remove" size="sm" flat icon="delete" @click="removeWidget(cacheItem.dashboard, layoutItem)"/>
                  </template>
                </widget>
            </grid-item>
        </grid-layout>
      </q-scroll-area>
    </div>

    <widget-chooser v-model="pinResourceModal" :pinned="pinnedResources" @done="pin" @cancel="cancelPin"/>

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
import { debounce, extend, uid, dom, colors } from 'quasar'
import WidgetChooser from '../components/WidgetChooser'
import {extend as extendSchema} from '../utils/schema'
import {dashboardWidgetSchemaDefaults} from '../core/widget'

const { offset, height, width } = dom

var GridLayout = VueGridLayout.GridLayout
var GridItem = VueGridLayout.GridItem

const DBL_CLICK_DELAY  = 200

const CACHE_TIMEOUT = 300000
const CACHE_CHECK_INTERVAL = 5000

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
        etag: '-',
        pageWidth: window.innerWidth,
        loading: false,
        iDashboard: 0,
        dashboards: [],
        cache: [],
        grid: {
          rowHeight: 120, // in px
          margin: 10
        },
        pinResourceModal: false,
        pinLayoutPreset: null,
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
    __index () {
      return this.$route.query.index || 0
    },

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
        if (dashboard) {
          this.cacheDashboard(dashboard)
          this.loadLayout(null, dashboard)
          this.loadColors()
        }
      },
      immediate: true
    },
    __index: {
      handler (val) {
        this.iDashboard = parseInt(val)
      },
      immediate: true
    },
    iDashboard: {
      handler (val) {
        this.$router.replace({
          query: {
            index: val
          }
        })
      },
      immediate: true
    }
  },

  methods: {

    cacheDashboard (dashboard) {
      var cache = this.cache, item = null;
      for(var i in cache) {
        if (cache[i].id === dashboard.id) {
          item = cache[i]
          break
        }
      }
      if (!item) {
        // not in cache, add it !
        console.log('add cache')
        item = {
          id: dashboard.id,
          dashboard
        }
        cache.push(item)
      }
      item.ts = Date.now()
    },

    checkCache () {
      var now = Date.now();
      var cache = this.cache;

      for(var i=0; i<cache.length; i++) {
        if (cache[i].id === this.currentDashboard.id) {
          cache[i].ts = now
        }
        else if (now > cache[i].ts + CACHE_TIMEOUT ) {
          console.log('remove cache')
          cache.splice(i, 1)
          i--
        }
      }
    },

    layoutUpdatedEvent (newLayout) {
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
      var save = false
      dashboard.items.forEach(item => {
        var layoutItem = this.findItemInLayout(layout, item.i)
        if (!layoutItem) {
          // find the first free place
          layoutItem = this.findFreePlaceInLayout(colNb, layout, 1, 1)

          layout.push({
            i:item.i,
            ...layoutItem
          })

          save = true
        }
        Object.assign(item, layoutItem)
      })

      if (save) {
        this.saveLayout()
        this.save()
      }
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

    loadColors () {
      if (!this.$el) return

      var options = this.currentDashboard.options

      var color = options.widgetsColor
      if (color) {
        colors.setBrand('light', colors.lighten(color, (colors.luminosity(color) < 0.5) ? 40 : -30), this.$el)
      }

      var primaryColor = options.primaryColor
      if (primaryColor) colors.setBrand('primary', primaryColor, this.$el)

      var secondaryColor = options.secondaryColor
      if (secondaryColor) colors.setBrand('secondary', secondaryColor, this.$el)

      var accentColor = options.accentColor
      if (accentColor) colors.setBrand('accent', accentColor, this.$el)
    },

    handleHold ({ evt, position, ...info }) {
      /*var gridEl = this.$refs.grid.$el
      var orig = offset(gridEl)
      var widgetWidth = (width(gridEl) - (this.__columns+1) * this.grid.margin) / this.__columns

      this.pinLayoutPreset = {
        x: Math.floor((position.left - orig.left) / (widgetWidth + this.grid.margin)),
        y: Math.floor((position.top - orig.top) / (this.grid.rowHeight + this.grid.margin))
      }*/

      this.pinResourceModal = true
    },

    bgClick (evt) {
      var ts = Date.now()

      /*if (! evt.srcElement.classList.contains('vue-grid-layout')) {
        // only background click
        return
      }*/

      var diff = ts - this.bgClickTs

      //console.log('bgClick', diff, evt)

      if (diff<5) return // bug

      if (diff < DBL_CLICK_DELAY) {
        // double click
        clearTimeout(this.bgClickTimer)
        //console.log('BG DBL CLICK')

        /*var gridEl = this.$refs.grid.$el
        var orig = offset(gridEl)
        var widgetWidth = (width(gridEl) - (this.__columns+1) * this.grid.margin) / this.__columns

        this.pinLayoutPreset = {
          x: Math.floor((evt.x - orig.left) / (widgetWidth + this.grid.margin)),
          y: Math.floor((evt.y - orig.top) / (this.grid.rowHeight + this.grid.margin))
        }*/

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
            layouts: {},
            id: uid()
          })
          this.iDashboard++
        } else {
          this.$set(this.currentDashboard, 'options', this.dashboardEdit.model)
          this.loadColors()
        }

        this.dashboardEdit.modal = false

        this.save()
      }
    },

    removeDashboard () {
      this.dashboards.splice(this.iDashboard, 1)

      if (!this.dashboards.length) {
        this.dashboards.push({
          options: {},
          items: [],
          layouts: {},
          id: uid()
        })
      }

      if (this.iDashboard >= this.dashboards.length) {
        this.iDashboard--
      }

      this.editing = false;

      this.save()
    },

    initDashboard (dashboards) {
      dashboards = dashboards || []

      if (dashboards.length == 0) {
        dashboards.push({})
      }

      dashboards = dashboards.map((d, i) => {

        var options = d.options || {}
        if (typeof options.title !== 'string') {
          options.title = 'dashboard #' + i
        }

        return {
          options,
          items: (d.widgets || []).map(l => this.normalizeLayoutItem(l)).filter(l => !!l),
          layouts: d.layouts || {},
          id: uid()
        }
      })

      this.dashboards = dashboards


    },

    load: function() {
      if (this.etag === this.$ethingUI.dashboard.config.etag) return
      var config = extend(true, {}, this.$ethingUI.dashboard.config) // deep copy
      this.initDashboard(config.dashboards)
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

    computeOptions (dashboard, layoutItem) {
      var options = extend(true, {}, layoutItem.item.options)

      if (!options.bgColor) {
        options.bgColor = dashboard.options.widgetsBackgroundColor
      }
      if (!options.color) {
        options.color = dashboard.options.widgetsColor
      }

      return options
    },

    save: debounce( function(){

      var dashboards = this.dashboards.map(d => {
        return {
          options: d.options,
          widgets: d.items.map(layoutItem => layoutItem.item),
          layouts: d.layouts
        }
      })

      this.etag = this.$ethingUI.dashboard.save({
        dashboards
      })

    }, 500),

    addWidget (attr, layoutPreset) {
      var l  = this.normalizeLayoutItem(attr)
      if (l) {
        Object.assign(l, layoutPreset || this.findFreePlaceInLayout())
        this.currentDashboard.items.push(l)
        this.saveLayout()
      }
    },

    pin (info) {
      this.addWidget(info, this.pinLayoutPreset)
      this.save()
      this.pinLayoutPreset = null
      this.pinResourceModal = false
    },

    cancelPin () {
      this.pinLayoutPreset = null
    },

    isEditable (dashboard, layoutItem) {
      return true
    },

    editItem (dashboard, layoutItem) {
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

    removeWidget (dashboard, layoutItem) {
      var index = dashboard.items.indexOf(layoutItem)
      if (index !== -1) {
        dashboard.items.splice(index, 1)

        // remove from layouts
        var layouts = dashboard.layouts
        for (var k in layouts) {
          var layout = layouts[k];
          for (var j in layout) {
            if (layout[j].i === layoutItem.i) {
              layout.splice(j, 1)
              break
            }
          }
        }

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
    },

    findFreePlaceInLayout (colNumber, layout, width, height) {
      colNumber = colNumber || this.__columns
      layout = layout || this.currentDashboard.layouts[colNumber] || {}
      width = width || 1
      height = height || 1

      function isFree(i, j) {
        var free = true
        for (var k in layout) {
          var item = layout[k];
          if (i>=item.x && i<(item.x+item.w) && j>=item.y && j<(item.y+item.h)) {
            // not free
            free = false
            break
          }
        }
        return free
      }

      for (var j=0; ; j++) {
        for (var i=0; i<colNumber; i++) {
          var free = true
          for (var w=0; w<width && free; w++) {
            for (var h=0; h<height && free; h++) {
              if(!isFree(i+w, j+h)) {
                free=false
                break
              }
            }
          }
          if (free) {
            return {
              x: i,
              y: j,
              w: width,
              h: height
            }
          }
        }
      }
    },

  },

  mounted () {
    this.$ethingUI.on('ui.dashboard.config', this.load)
    this.cacheTimer = setInterval(this.checkCache, CACHE_CHECK_INTERVAL)
    this.load()
  },

  beforeDestroy () {
    this.$ethingUI.off('ui.dashboard.config', this.load)
    if (this.cacheTimer) {
      clearInterval(this.checkCache)
    }
  }

}
</script>

<style lang="stylus" scoped>


.dpage {
  background-color: #f5f5f5;
}

/* Cf. https://github.com/taye/interact.js/issues/580 */
.gditem .dragger {
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
  height: 40px !important;
  width: 40px !important;
  background: none !important;
  border-bottom: 4px solid #ababab;
  border-right: 4px solid #ababab;
  padding: 0 !important;
  z-index: 5 !important;
  -ms-touch-action: none;
  touch-action: none;
}
</style>
