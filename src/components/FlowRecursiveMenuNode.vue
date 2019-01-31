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
        <q-item-side :icon="node.icon || 'mdi-puzzle'" :style="{color: node.color}" />
        <q-item-main>
          <q-item-tile label class="ellipsis">{{ node.title }}</q-item-tile>
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
