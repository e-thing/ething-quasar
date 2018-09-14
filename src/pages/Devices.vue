<template>
  <q-page padding>

    <div class="row justify-between">

      <div>
        <q-btn label="All" flat rounded color="faded" @click="category = ''"/>
        <q-btn label="Sensor" flat rounded color="faded" @click="category = 'sensor'"/>
        <q-btn label="Switch/Light" flat rounded color="faded" @click="category = 'switch'"/>
        <q-btn label="Camera" flat rounded color="faded" @click="category = 'camera'"/>
      </div>

      <div class="row">
        <!--<q-search v-model="filter" hide-underline no-parent-field clearable/>-->

        <q-btn-dropdown color="primary" label="Create" icon="add" flat >
          <q-list link>
            <template v-for="cat in categories">
              <q-list-header inset>{{ cat.name }}</q-list-header>
              <q-item v-close-overlay v-for="type in cat.types" :key="type.type" @click.native="create(type.name)">
                <q-item-side :icon="$meta.get(type.type).icon" :color="$meta.get(type.type).color" />
                <q-item-main>
                  <q-item-tile label>{{ type.label }}</q-item-tile>
                </q-item-main>
              </q-item>
            </template>
          </q-list>
        </q-btn-dropdown>
      </div>
    </div>

    <div v-if="listOrdered.length">
      <q-list link no-border>
          <resource-q-item v-for="(item, index) in deviceFiltered" :key="index" :resource="item.device" :level="item.level" no-parent />
      </q-list>
    </div>

    <div v-else class="absolute-center text-center">
      <p>
        <img
          src="~assets/sad.svg"
          style="width:30vw;max-width:150px;"
        >
      </p>
      <p class="text-faded">No devices installed</p>
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

    var resourcesDefinitions = this.$meta.definitions.resources
    Object.keys(resourcesDefinitions).forEach(name => {
      var meta = resourcesDefinitions[name]
      if (meta.inheritances.indexOf('resources/Device') !== -1 && !meta.virtual && !meta.disableCreation) {

        var path = meta.path || []
        var label = meta.label || name
        var category = path.length>0 ? path[0] : 'other'

        if (!categories[category]) {
          categories[category] = {
            types: []
          }
        }

        categories[category].types.push({
          label,
          name,
          type: 'resources/' + name
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
      categories: orderedCategories,
      filter: '',
      category: ''
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

      this.devices.filter(function(r){
  			return !hasParent(r)
      }).forEach(function(r){
        list = list.concat(order(r))
      })

      return list
    },

    deviceFiltered () {
      if (this.category || this.filter) {
        var devices = this.devices
        if (this.category) {
          switch (this.category) {
            case 'sensor':
              devices = devices.filter(r => r.isTypeof('interfaces/Sensor'))
              break;
            case 'switch':
              devices = devices.filter(r => r.isTypeof('interfaces/Switch'))
              break;
            case 'camera':
              devices = devices.filter(r => r.isTypeof('interfaces/Camera'))
              break;
          }
        }
        if (this.filter) {
          devices = this.applyFilter(devices)
        }

        return devices.map(r => {
          return {
            device: r,
            level: 0
          }
        })
      } else {
        return this.listOrdered
      }
    },

  },

  methods: {

    create (type) {
      this.$router.push('/create/'+type)
    },

    applyFilter (devices) {
      if (this.filter) {
        var re = new RegExp(this.filter)
        devices = devices.filter(r => re.test(r.name()) || re.test(r.id()))
      }

      return devices
    }

  }
}
</script>
