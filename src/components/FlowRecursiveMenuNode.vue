<template>
  <div>
    <q-collapsible v-for="(c, name) in root.children" :key="name" v-if="notEmpty(c)">
      <template slot="header">
        <q-item-main :label="formatLabel(name)" />
        <q-item-side right>
          <q-chip color="light" small dense square>
            {{ getLength(c) }}
          </q-chip>
        </q-item-side>
      </template>

      <flow-recursive-menu-node :root="c" :filter="filter" @click="$emit('click', $event)"/>

    </q-collapsible>

    <drag :transfer-data="{node}" v-for="(node, index) in root.nodes" :key="index" v-if="filter(node)">
      <q-item :style="{color: node.color}" style="cursor: pointer;" class="q-px-md" @click.native="click(node)">
        <q-item-main>
          <div class="node">
            <div class="endpoint" v-if="node.inputs"></div>
            <q-icon class="icon" :name="node.icon || 'mdi-puzzle'" />
            <div class="content">
               {{ node.title }}
            </div>
            <div class="endpoint" v-if="node.outputs"></div>
          </div>
        </q-item-main>
      </q-item>
    </drag>
  </div>
</template>

<script>
import { Drag } from 'vue-drag-drop'

export default {
    name: 'FlowRecursiveMenuNode',

    components: {
      Drag
    },

    props: ['root', 'filter'],

    methods: {

      getLength (i) {
        var l = i.nodes.length

        Object.keys(i.children).forEach(cn => {
          l += this.getLength(i.children[cn])
        })

        return l
      },
      notEmpty (i) {
        if(i.nodes.length) return true

        Object.keys(i.children).forEach(cn => {
          if (this.notEmpty(i.children[cn])) return true
        })

        return false
      },
      click (node) {
        this.$emit('click', node)
      },
      formatLabel (name) {
        // make user friendly labels
        if (/^[a-zA-Z]+$/.test(name)) {
          name = name.replace(/([a-z])([A-Z])/g, '$1 $2')
        }
        if (/^[a-zA-Z_]+$/.test(name)) {
          name = name.replace('_', ' ')
        }
        return name
      }

    },

}
</script>

<style scoped>

.endpoint {
  width: 14px;
  height: 14px;
  border-radius: 7px;
  background-color: rgb(122, 176, 44);
  /*border: 1px solid gray;*/
  display: block;
  position: absolute;
  top: 50%;

}

.endpoint:first-child {
  left: 0px;
  transform: translate(-50%, -50%);
}

.endpoint:last-child {
  right: 0px;
  transform: translate(50%, -50%);
}

.node {
    width: 100%;
    height: 42px;
    border: 1px solid #346789;
    box-shadow: 2px 2px 19px #aaa;
    -o-box-shadow: 2px 2px 19px #aaa;
    -webkit-box-shadow: 2px 2px 19px #aaa;
    -moz-box-shadow: 2px 2px 19px #aaa;
    -moz-border-radius: 5px;
    border-radius: 5px;
    opacity: 0.8;
    display: flex;
    /*justify-content: center;
    align-items: center;
    cursor: pointer;
    text-align: center;*/
    z-index: 20;
    position: relative;
    background-color: #eeeeef;
    color: black;
    font-family: helvetica, sans-serif;
    /*padding: 0.5em;*/
    /*font-size: 0.9em;*/
}

.node > .icon {
  font-size: 24px;
  width: 50px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  background-color: #c1c1c1;
}

.node > .content {
  width: auto;
  min-width: 0;
  max-width: 100%;
  -webkit-box-flex: 10000;
  -ms-flex: 10000 1 0%;
  flex: 10000 1 0%;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  text-align: center;
  display: flex;
  font-size: 0.9em;
}
</style>
