<template>
  <q-page class="bg-grey-2">

    <div v-if="loading">
      <q-inner-loading class="text-center" :visible="loading">
        <div class="q-pa-lg text-primary">loading...</div>
        <q-spinner-oval color="primary" size="50px" />
      </q-inner-loading>
    </div>

    <div v-else-if="layout.length==0" class="absolute-center text-center">
      <p>
        <img
          src="~assets/sad.svg"
          style="width:30vw;max-width:150px;"
        >
      </p>
      <p class="text-faded">No widgets</p>
      <q-btn icon="mdi-pin" label="pin resource" color="secondary" @click="pinResourceModal = true"/>
      <q-btn icon="mdi-pin" label="pin widget" color="secondary" @click="pinWidgetModal = true"/>
    </div>

    <div v-else>
      <q-window-resize-observable @resize="onResize" />

      <q-btn-group flat >
        <q-btn flat icon="mdi-pin" label="pin resource" color="faded" @click="pinResourceModal = true"/>
        <q-btn flat icon="mdi-pin" label="pin widget" color="faded" @click="pinWidgetModal = true"/>
        <q-btn flat icon="edit" :color="editing ? 'primary' : 'faded'" label="edit" @click="editing = !editing"/>
      </q-btn-group>

      <div v-if="smallScreen && !$q.platform.is.desktop && !$q.platform.is.electron && !$q.platform.is.chromeExt" class="smallScreenContainer">
        <div v-for="(layoutItem) in layout" :key="layoutItem.i" :style="{height: (layoutItem.h * grid.rowHeight) + 'px'}" class="bg-white">
          <div v-show="editing" class="absolute-center">
            <q-btn-group flat >
              <q-btn flat icon="delete" color="negative" @click="removeItem(layoutItem)"/>
            </q-btn-group>
          </div>
          <widget v-show="!editing" class="fit" :widgetClass="layoutItem.component" :widgetOptions="layoutItem.item.options" />
        </div>
      </div>
      <grid-layout v-else
        :layout="layout"
        :col-num="grid.columnNb"
        :row-height="grid.rowHeight"
        :is-draggable="draggable"
        :is-resizable="resizable"
        :is-mirrored="true"
        :vertical-compact="true"
        :margin="[10, 10]"
        :use-css-transforms="true"
      >
          <grid-item v-for="(layoutItem) in layout" :key="layoutItem.i"
             :x="layoutItem.x"
             :y="layoutItem.y"
             :w="layoutItem.w"
             :h="layoutItem.h"
             :i="layoutItem.i"
             :minW="layoutItem.minW"
             :minH="layoutItem.minH"
             @resized="resizedEvent"
             @moved="movedEvent"
             class="bg-white gditem"
          >
              <div v-show="editing" class="absolute fit widget-edit-layer">
                <q-btn-group flat class="absolute-center" >
                  <q-btn v-if="isEditable(layoutItem)" flat icon="settings" color="faded" @click="editItem(layoutItem)"/>
                  <q-btn flat icon="delete" color="negative" @click="removeItem(layoutItem)"/>
                </q-btn-group>
              </div>
              <div v-show="layoutItem.hasContentOverflow && !editing" class="absolute fit widget-overflow-layer">
                <div class="absolute-center">
                  This widget needs to be resized
                </div>
              </div>
              <widget :ref="'widget_' + layoutItem.i" :key="layoutItem.key" class="absolute fit" :widgetClass="layoutItem.component" :widgetOptions="layoutItem.item.options" />
          </grid-item>
      </grid-layout>
    </div>

    <resource-pin-form v-model="pinResourceModal" :pinned="pinnedResources" :maximized="smallScreen" @done="pin"/>

    <widget-pin-form v-model="pinWidgetModal" :maximized="smallScreen" @done="pin"/>

    <modal v-model="widgetEdit.modal" title="Edit" icon="edit" :valid-btn-disable="widgetEdit.error" @valid="widgetEditDone">

      <div class="q-title q-my-md">Options</div>
      <form-schema :schema="widgetEdit.schema" v-model="widgetEdit.model" @error="widgetEdit.error = $event"/>

    </modal>

  </q-page>
</template>

<script>

import Vue from 'vue'
import EThing from 'ething-js'
import VueGridLayout from 'vue-grid-layout'
import Widget from 'ething-quasar-core/src/components/Widget'
import { debounce, extend } from 'quasar'
import ResourcePinForm from '../components/ResourcePinForm'
import WidgetPinForm from '../components/WidgetPinForm'

var GridLayout = VueGridLayout.GridLayout
var GridItem = VueGridLayout.GridItem

const LAYOUT_FILENAME = ".dashboard.json"

export default {
  name: 'PageDashboard',

  components: {
    GridLayout,
    GridItem,
    Widget,
    ResourcePinForm,
    WidgetPinForm
  },

  data () {

    return {
        loading: false,
        layout: [],
        grid: {
          columnNb: 6,
          rowHeight: 60, // in px
          minWidth: 680 // in px, below this threshold, switch to small screen layout (ie, no grid)
        },
        idCnt: 1,
        pinResourceModal: false,
        pinWidgetModal: false,
        editing: false,
        smallScreen: false,

        widgetEdit: {
          modal: false,
          item: null,
          schema: {},
          model: {},
          error: false
        }
    }
  },

  computed: {
    resizable () {
      return this.editing
    },
    draggable () {
      return this.editing
    },
    pinnedResources () {
      return this.layout.map(l => l.item.options.resource).filter(r => !!r)
    }
  },

  methods: {

    getLayoutItem (index) {
      for (var i in this.layout) {
        if (this.layout[i].i === index) {
          return this.layout[i]
        }
      }
    },

    checkWidgetsContentOverflow () {
      for (let i in this.layout) {
        let layoutItem = this.layout[i]
        let component = this.$refs['widget_' + layoutItem.i][0]
        if (component) {
          setTimeout(() => {
            this.$set(layoutItem, 'hasContentOverflow', component.hasContentOverflow())
          }, 200)
        }
      }
    },

    movedEvent (i, newX, newY) {
      this.save()
    },

    resizedEvent (i, newH, newW, newHPx, newWPx) {
      var component = this.$refs['widget_' + i][0]

      if (component) {
        setTimeout(() => {
          this.$set(this.getLayoutItem(i), 'hasContentOverflow', component.hasContentOverflow())
        }, 200)
      }

      this.save()
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

    load: function() {
      this.loading = true

      var file = this.file()

      if (file) {
        file.read().then( (config) => {

          if(typeof config == 'string')
						try{
							config = JSON.parse(config);
						}
						catch(e){
              config = {}
            }

          var layout = config.widgets || []
          layout = layout.map(this.normalizeLayoutItem).filter(l => !!l)

          this.layout = layout

          setTimeout(() => {
            this.checkWidgetsContentOverflow()
          }, 1)

        }).finally(() => {
          this.loading = false
        })
      } else {
        this.loading = false
      }

    },

    normalizeLayoutItem (item) {
      try {
        var widgetClass = null;

        if (typeof item.widgetId !== 'undefined') {
          widgetClass = this.$ethingUI.get(item.options.resource).widgets[item.widgetId]
          if (typeof widgetClass === 'string') {
            var widgetClassName = widgetClass
            widgetClass = this.$ethingUI.findWidget(widgetClassName)
            if (!widgetClass) {
              console.error('unknown widget type: ' + widgetClassName)
              return
            }
          }
        } else {
          widgetClass = this.$ethingUI.findWidget(item.widgetType)
          if (!widgetClass) {
            console.error('unknown widget type: ' + item.widgetType)
            return
          }
        }

        var component = Vue.extend(widgetClass)

        var metadata = component.options.metadata

        var minWidth = 1
        var minHeight = 1
        if (metadata.minWidth) {
          var widthUnit = Math.floor(this.grid.minWidth / this.grid.columnNb)
          minWidth = Math.max(Math.min(Math.round(metadata.minWidth / widthUnit), this.grid.columnNb), 1)
        }
        if (metadata.minHeight) {
          minHeight = Math.max(Math.round(metadata.minHeight / this.grid.rowHeight), 1)
        }

        if (!item.w || item.w<minWidth) item.w = minWidth
        if (!item.h || item.h<minHeight) item.h = minHeight

        if (!item.x) item.x = 0
        if (!item.y) item.y = 0
        if (!item.options) item.options = {}

        var layoutItem = {
          key: 0,
          hasContentOverflow: false,
          component: component,
          cls: widgetClass,
          item: item,
          metadata,
          x: item.x,
          y: item.y,
          w: item.w,
          h: item.h,
          minW: minWidth,
          minH: minHeight,
          i: String(this.idCnt++)
        }

        return layoutItem
      } catch(err) {
        console.error(err)
      }
    },

    save: debounce( function(){
      this.file( file => {
        var config = {}
        config.widgets = this.layout.map(layoutItem => {
          return Object.assign(layoutItem.item, {
            x: layoutItem.x,
            y: layoutItem.y,
            w: layoutItem.w,
            h: layoutItem.h
          })
        })
        file.write( JSON.stringify(config, null, 4) )
      })
    }, 500),

    addWidget (attr) {
      var l  = this.normalizeLayoutItem(attr)
      if (l)
        this.layout.push(l)
    },

    pin (info) {

      this.addWidget(info)

      this.save()

      this.pinResourceModal = false
    },

    isEditable (layoutItem) {
      return Object.keys(layoutItem.metadata.options || {}).length>0
    },

    editItem (layoutItem) {
      var schema = Object.assign({type: 'object'}, layoutItem.metadata.options)

      this.widgetEdit.layoutItem = layoutItem
      this.widgetEdit.schema = schema
      this.widgetEdit.model = extend(true, {}, layoutItem.item.options)
      this.widgetEdit.error = false
      this.widgetEdit.modal = true

    },

    widgetEditDone () {
      if (!this.widgetEdit.error) {

        Object.assign(this.widgetEdit.layoutItem.item.options, this.widgetEdit.model)

        this.widgetEdit.layoutItem.key++

        this.widgetEdit.modal = false

        this.save()
      }
    },

    removeItem (layoutItem) {
      var index = this.layout.indexOf(layoutItem)
      if (index !== -1) {
        this.layout.splice(index, 1)
        this.save()
      }
    },

    onResize (size) {
      // {
      //   width: 1200 // width of viewport (in px)
      //   height: 920 // height of viewport (in px)
      // }

      this.smallScreen = size.width < this.grid.minWidth
    }

  },

  mounted () {
    this.load()
  }

}
</script>

<style lang="stylus" scoped>
@import '~variables'

/* Cf. https://github.com/taye/interact.js/issues/580 */
.gditem {
  -ms-touch-action: none;
      touch-action: none;
}

.vue-grid-item {
    border: 1px solid #f4f4f4;
}

.smallScreenContainer > div {
  width: 100%;
  position: relative;
  border: 1px solid #f4f4f4;
}

.smallScreenContainer > div:not(:first-child) {
  margin-top: 10px;
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
  width: 40px;
  height: 40px;
  transition: all 0.5s;
  transform-origin: right bottom;
  z-index: 5;
}

.vue-resizable-handle:hover {
  transform: scale(3);
}
</style>
