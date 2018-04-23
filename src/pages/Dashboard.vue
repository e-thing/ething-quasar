<template>
  <q-page>

    <q-btn-group flat >
      <q-btn label="pin resource" @click="pinModal = true"/>
    </q-btn-group>

    <grid-layout :layout="layout"
                 :col-num="6"
                 :row-height="60"
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
            <!--<div class="absolute-center">{{ item.i }}</div>-->
            <widget :type="item.type" :options="item.options" />
            <!--<div :is="item.type || 'q-btn'" icon="alarm" :label="item.i" />-->
        </grid-item>
    </grid-layout>


    <q-modal v-model="pinModal" :content-css="{padding: '50px', minWidth: '50vw'}">
      <div class="q-display-1 q-mb-md">Basic Modal</div>

      <q-field
        label="Resource"
        helper="Select the resource"
      >
        <resource-select :filter="pinResourceFilter" v-model="pinResource"/>
      </q-field>

      <q-btn
        color="primary"
        @click="pin"
        label="pin"
      />
      <q-btn
        color="negative"
        @click="pinModal = false"
        label="Cancel"
      />
    </q-modal>

  </q-page>
</template>

<script>

import Vue from 'vue'
import EThing from 'ething-js'
import VueGridLayout from 'vue-grid-layout'
import Widget from '../components/Widget'
import { throttle } from 'quasar'
import ResourceSelect from '../components/ResourceSelect'

var GridLayout = VueGridLayout.GridLayout
var GridItem = VueGridLayout.GridItem

var testLayout = [
    {"x":0,"y":0,"w":2,"h":2,"i":"0",type:"w-label", options: {label: "toto"}},
    {"x":2,"y":0,"w":2,"h":4,"i":"1", type: "w-knob", options: {icon: "alarm"}},
    /*{"x":4,"y":0,"w":2,"h":5,"i":"2"},
    {"x":0,"y":5,"w":2,"h":5,"i":"6"},
    {"x":2,"y":5,"w":2,"h":5,"i":"7"},
    {"x":4,"y":5,"w":2,"h":5,"i":"8"},
    {"x":0,"y":10,"w":2,"h":5,"i":"12"},
    {"x":2,"y":10,"w":2,"h":5,"i":"13"},
    {"x":4,"y":8,"w":2,"h":4,"i":"14"},
    {"x":0,"y":9,"w":2,"h":3,"i":"18"},
    {"x":2,"y":6,"w":2,"h":2,"i":"19"}*/
];

const LAYOUT_FILENAME = ".dashboard.json"

export default {
  name: 'PageDashboard',

  components: {
    GridLayout,
    GridItem,
    Widget,
    ResourceSelect
  },

  data () {
    return {
        layout: [],
        draggable: true,
        resizable: true,
        idCnt: 1,
        pinModal: false,
        pinResource: null
    }
  },

  methods: {
    movedEvent (i, newX, newY) {
        var msg = "MOVED i=" + i + ", X=" + newX + ", Y=" + newY;
        console.log(msg);
        this.save()
    },
    /**
     *
     * @param i the item id/index
     * @param newH new height in grid rows
     * @param newW new width in grid columns
     * @param newHPx new height in pixels
     * @param newWPx new width in pixels
     *
     */
    resizedEvent (i, newH, newW, newHPx, newWPx) {
        var msg = "RESIZED i=" + i + ", H=" + newH + ", W=" + newW + ", H(px)=" + newHPx + ", W(px)=" + newWPx;
        console.log(msg);
        this.save()
    },

    file (callback) {
      var file = this.$ething.arbo.findOne( (r) => {
				return r instanceof this.$ething.File && r.name() === LAYOUT_FILENAME;
			})

      if (typeof callback === 'function'){
        if (!file) {
          // create the file if not found !
          this.$ething.File.create({
  					name: LAYOUT_FILENAME
  				}).done( (file) => {
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
        file.read().done( (config) => {
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

    save: throttle( function(){
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

    pin () {
      var widgetName = EThing.meta.get(this.pinResource).widgets[0]
      var widget = EThing.widgets.find(widgetName)

      this.addWidget({
        w: widget.minWidth || 1,
        h: widget.minHeight || 1,
        type: widgetName,
        options: {
          resource: this.pinResource.id()
        }
      })

      this.save()

      this.pinModal = false
    },

    pinResourceFilter (r) {
      return EThing.meta.get(r).widgets.length
    }

  },

  mounted () {
    this.load()
  }

}
</script>

<style scoped>

.vue-grid-item {
    border: 1px solid #e0e0e0
}

</style>
