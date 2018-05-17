<template>
  <q-page>

    <q-window-resize-observable @resize="onResize" />

    <q-btn-group flat >
      <q-btn flat icon="mdi-pin" label="pin resource" color="faded" @click="pinModal = true"/>
      <q-btn flat icon="edit" :color="editing ? 'primary' : 'faded'" label="edit" @click="editing = !editing"/>
    </q-btn-group>

    <div v-if="smallScreen" class="smallScreenContainer">
      <div v-for="(item) in layout" :key="item.i" :style="{height: (item.h * grid.rowHeight) + 'px'}">
        <div v-show="editing" class="absolute-center">
          <q-btn-group flat >
            <q-btn flat icon="delete" color="negative" @click="removeItem(item)"/>
          </q-btn-group>
        </div>
        <widget v-show="!editing" class="fit" :type="item.type" :options="item.options" />
      </div>
    </div>
    <grid-layout v-else
      :layout="layout"
      :col-num="grid.columnNb"
      :row-height="grid.rowHeight"
      :is-draggable="draggable"
      :is-resizable="resizable"
      :is-mirrored="false"
      :vertical-compact="true"
      :margin="[10, 10]"
      :use-css-transforms="true"
    >
        <grid-item v-for="(item) in layout" :key="item.i"
           :x="item.x"
           :y="item.y"
           :w="item.w"
           :h="item.h"
           :i="item.i"
           @resized="resizedEvent"
           @moved="movedEvent"
        >
            <div v-show="editing" class="absolute-center">
              <q-btn-group flat >
                <q-btn flat icon="delete" color="negative" @click="removeItem(item)"/>
              </q-btn-group>
            </div>
            <widget v-show="!editing" class="fit" :type="item.type" :options="item.options" />
        </grid-item>
    </grid-layout>


    <q-modal v-model="pinModal" :maximized="smallScreen" :content-css="smallScreen ? pinModalCss : pinModalCssBigScreen">
      <div class="q-headline q-mb-md">Pin resource</div>

      <resource-pin-form :pinned="pinnedResources" @done="pin" @cancel="pinModal = false"/>

    </q-modal>

  </q-page>
</template>

<script>

import Vue from 'vue'
import EThing from 'ething-js'
import VueGridLayout from 'vue-grid-layout'
import Widget from '../components/Widget'
import { debounce } from 'quasar'
import ResourcePinForm from '../components/ResourcePinForm'

var GridLayout = VueGridLayout.GridLayout
var GridItem = VueGridLayout.GridItem

const LAYOUT_FILENAME = ".dashboard.json"

export default {
  name: 'PageDashboard',

  components: {
    GridLayout,
    GridItem,
    Widget,
    ResourcePinForm
  },

  data () {

    var pinModalCss = {
      padding: '32px'
    }

    return {
        layout: [],
        grid: {
          columnNb: 6,
          rowHeight: 60, // in px
          minWidth: 680 // in px, below this threshold, switch to small screen layout (ie, no grid)
        },
        idCnt: 1,
        pinModal: false,
        editing: false,
        smallScreen: false,
        pinModalCss,
        pinModalCssBigScreen: Object.assign({
          minWidth: '50vw',
          maxWidth: '80vw',
          height: '100vh',
          maxHeight: '100vh'
        }, pinModalCss)
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
      return this.layout.map(l => l.options.resource).filter(r => !!r)
    }
  },

  methods: {
    movedEvent (i, newX, newY) {
        this.save()
    },

    resizedEvent (i, newH, newW, newHPx, newWPx) {
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
          layout.forEach( w => {
            w.i = this.idCnt++
          })

          this.layout = layout
        })
      }

    },

    save: debounce( function(){
      this.file( file => {
        var config = {}
        config.widgets = this.layout.map( item => {
          var w = Object.assign({}, item)
          delete w.i
          return w
        })
        file.write( JSON.stringify(config, null, 4) )
      })
    }, 500),

    addWidget (attr) {
      this.layout.push(Object.assign({
        x: 0,
        y: 0,
        w: 1,
        h: 1,
        i: this.idCnt++,
        options: {}
      },attr))
    },

    pin (info) {

      var widgetClass = info.widgetClass
      var meta = widgetClass.meta || {}
      var minWidthUnit = 1
      var minHeightUnit = 1

      // map pixel to unit
      if (meta.minWidth) {
        var widthUnit = Math.floor(this.grid.minWidth / this.grid.columnNb)
        minWidthUnit = Math.max(Math.min(Math.round(meta.minWidth / widthUnit), this.grid.columnNb), 1)
      }
      if (meta.minHeight) {
        minHeightUnit = Math.max(Math.round(meta.minHeight / this.grid.rowHeight), 1)
      }

      var widgetOptions = Object.assign({}, info.widget)
      delete widgetOptions.name

      this.addWidget({
        w: minWidthUnit,
        h: minHeightUnit,
        type: info.widgetName,
        options: Object.assign({
          resource: info.resource.id()
        }, info.options, widgetOptions)
      })

      this.save()

      this.pinModal = false
    },

    removeItem (item) {
      var index = this.layout.indexOf(item)
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

<style scoped>

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

</style>
