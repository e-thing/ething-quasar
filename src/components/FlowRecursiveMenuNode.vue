<template>
  <div>
    <q-collapsible v-for="(c, name) in tree.children" :key="name" v-if="notEmpty(c)">
      <template slot="header">
        <q-item-main :label="formatLabel(name)" />
        <q-item-side right>
          <q-chip color="light" small dense square>
            {{ getLength(c) }}
          </q-chip>
        </q-item-side>
      </template>

      <flow-recursive-menu-node :root="c" :ns="join(ns, name)" :filter="filter" @click="$emit('click', $event)"/>

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

    <drag :transfer-data="{name, node, type: join(ns, name)}" v-for="(node, name) in tree.nodes" :key="name">
      <q-item :style="{color: node.color}" style="cursor: pointer;" class="q-px-md" @click.native="click(node, name)">
        <q-item-side :icon="node.icon || 'mdi-puzzle'" :style="{color: node.color}" />
        <q-item-main>
          <q-item-tile label class="ellipsis">{{ formatLabel(node.label) }}</q-item-tile>
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

    props: ['root', 'ns', 'filter'],

    computed: {

      tree () {
        return this.parse(this.root)
      }
    },

    methods: {
      parse (r) {
        var n = {}
        var c = {}

        for (var name in r) {
          var item = r[name]
          if (item.type === 'class' && !item.virtual) {
            if (!this.filter || this.filter(item)) {
              n[name] = item
            }
          }
          else if (typeof item.type === 'undefined') {
            c[name] = item
          }
        }

        return {
          nodes: n,
          children: c
        }
      },
      getLength (r) {

        var res = this.parse(r)
        var l = Object.keys(res.nodes).length

        Object.keys(res.children).forEach(cn => {
          l += this.getLength(res.children[cn])
        })

        return l
      },
      notEmpty (r) {
        var res = this.parse(r)

        if(Object.keys(res.nodes).length) return true

        Object.keys(res.children).forEach(cn => {
          if (this.notEmpty(res.children[cn])) return true
        })

        return false
      },
      click (node, name) {
        this.$emit('click', this.join(this.ns, name))
      },
      join (ns, name) {
        var fullName = name
        if (ns) {
          fullName = ns + '/' + fullName
        }
        return fullName
      },
      formatLabel (name) {
        // make user friendly labels
        if (/^[a-zA-Z]+$/.test(name)) {
          name = name.replace(/([a-z])([A-Z])/g, '$1 $2')
        }
        return name
      }

    },

}
</script>

<style scoped>

</style>
