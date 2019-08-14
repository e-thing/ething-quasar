<template>
  <q-list>
    <template
      v-for="(item, index) in __items"
    >
      <slot name="resource-item" v-bind:item="item">
        <resource-q-item
          :resource="item.resource"
          :level="item.level"
          :no-parent="item.level>0"
          :readonly="readonly"
          :dense="dense"
          @click="itemClick(item)"
        />
      </slot>
    </template>
  </q-list>
</template>

<script>
import ResourceQItem from '../components/ResourceQItem'


export default {
    name: 'ResourceList',

    components: {
      ResourceQItem
    },

    props: {
      resources: {},
      tree: Boolean,
      readonly: Boolean,
      dense: Boolean,
    },

    data () {
        return {

        }
    },

    computed: {

      __resources () {
        var resources = [];
        if (typeof this.resources === 'function') {
          resources = this.$ething.arbo.find(this.resources)
        } else if (Array.isArray(this.resources)) {
          resources = this.resources.map(r => {
            if (typeof r === 'string') return this.$ething.arbo.get(r)
            return r
          })
        }
        return resources
      },

      __items () {
        if (this.tree) {
          return this.makeTree(this.__resources)
        } else {
          return this.__resources.map(r => {
            return {
              resource: r,
              level: 0
            }
          })
        }
      }

    },

    methods: {

      makeTree (resources) {

        var list = []

        var get = id => {
          for(var i in resources) {
            if(resources[i].id() == id) return resources[i]
          }
        }

        var getChildren = resource => {
      		return resources.filter(r => {
      			return r.createdBy() === resource.id()
      		});
      	}

      	var hasParent = resource => {
          var createdById = resource.createdBy()
      		return createdById && get(createdById);
      	}

      	var level = 0;

        var create = resource => {
          return {
            resource,
            level,
          }
        }

        var order = resource => {
          var list = [create(resource)]

          level++;
      		getChildren(resource).map( r => {
      			list = list.concat(order(r))
      		});
      		level--;

          return list
        }

        resources.filter(r => {
    			return !hasParent(r)
        }).forEach(r => {
          list = list.concat(order(r))
        })

        return list
      },

      itemClick (item) {
        this.$emit('click', item.resource)
      }

    }


}
</script>
