<template>
  <q-page>
    
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
            <div :is="item.type" v-bind="item.options" />
            <!--<div :is="item.type || 'q-btn'" icon="alarm" :label="item.i" />-->
        </grid-item>
    </grid-layout>
    
  </q-page>
</template>

<script>

import Vue from 'vue'
import VueGridLayout from 'vue-grid-layout'

var GridLayout = VueGridLayout.GridLayout
var GridItem = VueGridLayout.GridItem

var testLayout = [
    {"x":0,"y":0,"w":2,"h":2,"i":"0",type:"q-btn", options: {label: "toto"}},
    {"x":2,"y":0,"w":2,"h":4,"i":"1", type: "q-chip", options: {icon: "alarm"}},
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

export default {
  name: 'PageDashboard',
  
  components: {
    GridLayout,
    GridItem
  },
  
  data () {
    return {
        layout: testLayout,
        draggable: true,
        resizable: true,
    }
  },
  
  methods: {
    movedEvent: function(i, newX, newY){
        var msg = "MOVED i=" + i + ", X=" + newX + ", Y=" + newY;
        console.log(msg);

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
    resizedEvent: function(i, newH, newW, newHPx, newWPx){
        var msg = "RESIZED i=" + i + ", H=" + newH + ", W=" + newW + ", H(px)=" + newHPx + ", W(px)=" + newWPx;
        console.log(msg);
    },
  }
  
}
</script>

<style scoped>

.vue-grid-item {
    border: 1px solid #e0e0e0
}

</style>
