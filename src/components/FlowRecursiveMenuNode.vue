<template>
  <div class="no-scroll">
    <q-expansion-item v-for="(c, name) in root.children" :key="name" v-if="notEmpty(c)" :opened="opened" expand-separator>
      <template slot="header">
        <q-item-section>
          {{ formatLabel(name) }}
        </q-item-section>
        <q-item-section side>
          <q-chip color="light" dense square>
            {{ getLength(c) }}
          </q-chip>
        </q-item-section>
      </template>

      <flow-recursive-menu-node :root="c" @click="$emit('click', $event)">
        <template v-for="slot in Object.keys($scopedSlots)" :slot="slot" slot-scope="node"><slot :name="slot" v-bind="node"/></template>
      </flow-recursive-menu-node>

    </q-expansion-item>

    <drag :transfer-data="{node}" v-for="(node, index) in root.nodes" :key="index">
      <q-item :style="{color: node.color}" style="cursor: pointer;" class="q-px-md" clickable @click="$emit('click', node)">
        <q-item-section>
          <slot :node="node" />
        </q-item-section>
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

    props: ['root', 'opened'],

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
