<template>
  <div>
    <q-collapsible v-for="(cat, index) in node.categories" :key="cat.name">
      <template slot="header">
        <q-item-main :label="cat.name" />
        <q-item-side right>
          <q-chip color="light" small dense square>
            {{ getLength(cat) }}
          </q-chip>
        </q-item-side>
      </template>

      <flow-recursive-menu-node :node="cat" @click="$emit('click', $event)"/>

      <!--
      <div v-for="node in cat.nodes" :key="node.type">
        <drag :transfer-data="{node}">
          <q-btn flat :icon="node.icon || 'mdi-puzzle'" align="left" :style="{color: node.color}" :label="node.type" no-wrap @click="addNodeClick(node.type)" class="full-width"/>
        </drag>
      </div>
      -->

      <!--
      <drag :transfer-data="{node}" v-for="node in cat.nodes" :key="node.type">
        <q-item :style="{color: node.color}" style="cursor: pointer;" class="q-px-none" @click.native="addNodeClick(node.type)">
          <q-item-side :icon="node.icon || 'mdi-puzzle'" :style="{color: node.color}" />
          <q-item-main>
            <q-item-tile label class="ellipsis">{{ node.type }}</q-item-tile>
          </q-item-main>
        </q-item>
      </drag>
      -->

    </q-collapsible>

    <drag :transfer-data="{node}" v-for="node in node.nodes" :key="node.type">
      <q-item :style="{color: node.color}" style="cursor: pointer;" class="q-px-sm" @click.native="$emit('click', node)">
        <q-item-side :icon="node.icon || 'mdi-puzzle'" :style="{color: node.color}" />
        <q-item-main>
          <q-item-tile label class="ellipsis">{{ node.label }}</q-item-tile>
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

    props: ['node'],

    methods: {
      getLength (cat) {
        var l = cat.nodes.length

        cat.categories.forEach(c => {
          l += this.getLength(c)
        })

        return l
      }
    },

}
</script>

<style scoped>

</style>
