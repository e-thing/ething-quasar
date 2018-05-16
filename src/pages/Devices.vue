<template>
  <q-page padding>

    <div class="row justify-end">
      <q-btn-dropdown color="primary" label="Create" icon="add" flat >
        <q-list link>
          <template v-for="cat in categories">
            <q-list-header inset>{{ cat.name }}</q-list-header>
            <q-item v-close-overlay v-for="type in cat.types" :key="type.type" @click.native="create(type.type)">
              <q-item-side :icon="$meta.get(type.type).icon" :color="$meta.get(type.type).color" />
              <q-item-main>
                <q-item-tile label>{{ type.label }}</q-item-tile>
              </q-item-main>
            </q-item>
          </template>
        </q-list>
      </q-btn-dropdown>
    </div>

    <div v-if="listOrdered.length">
      <q-list link no-border>
          <resource-q-item v-for="(item, index) in listOrdered" :key="index" :resource="item.device" :level="item.level" no-parent />
      </q-list>
    </div>

    <div v-else class="q-pa-md">
    No devices installed.
    </div>

  </q-page>
</template>

<script>
import EThing from 'ething-js'
import ResourceQItem from '../components/ResourceQItem'


export default {
  name: 'PageDevices',

  components: {
    ResourceQItem
  },

  data () {

    var categories = {}

    this.$meta.types.forEach(type => {
      var meta = this.$meta.get(type)
      if (meta.inheritances.indexOf('Device') !== -1 && !meta.virtual) {

        var path = meta.path || []
        var label = meta.label || type
        var category = path.length>0 ? path[0] : 'other'

        if (!categories[category]) {
          categories[category] = {
            types: []
          }
        }

        categories[category].types.push({
          label,
          type
        })
      }
    })

    var other = categories['other']
    var orderedCategories = []

    delete categories['other']

    for(var category in categories){
      orderedCategories.push(Object.assign({
        name: category
      }, categories[category]))
    }

    orderedCategories.push(Object.assign({
      name: 'other'
    }, other))

    return {
      categories: orderedCategories
    }
  },

  computed: {
    devices () {
      return this.$store.getters['ething/filter'](r => {
        return r instanceof this.$ething.Device
      })
    },

    listOrdered () {

      var list = []
      var self = this

      function getChildren(resource){
    		return self.$store.getters['ething/filter'](function(r){
    			return r.createdBy() === resource.id() && (r instanceof EThing.Device)
    		});
    	}

    	function hasParent(resource){
    		return !!resource.createdBy();
    	}

    	var level = 0;

      function create(resource) {
        return {
          device: resource,
          level,
          indent: level * 20
        }
      }

      function order(resource) {
        var list = [create(resource)]

        level++;
    		getChildren(resource).map(function(r){
    			list = list.concat(order(r))
    		});
    		level--;

        return list
      }

      this.$store.getters['ething/filter'](function(r){
  			return (r instanceof EThing.Device)
  		}).filter(function(r){
  			return !hasParent(r)
      }).forEach(function(r){
        list = list.concat(order(r))
      })

      return list
    },

  },

  methods: {

    create (type) {
      this.$router.push('/create/'+type)
    }

  }
}
</script>
