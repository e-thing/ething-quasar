<template>
  <q-page class="page page-width-lg">

    <div class="row page-block" style="background: transparent;">

      <div class="q-gutter-x-xs">
        <q-btn class="bg-white" flat label="All" :text-color="category==='' ? 'primary' : 'faded'" @click="category = ''"/>
        <q-btn class="bg-white" flat :text-color="category==='sensor' ? 'primary' : 'faded'" @click="category = 'sensor'">
          <q-icon name="mdi-thermometer"/>
          <span class="gt-sm q-ml-xs">Sensor</span>
        </q-btn>
        <q-btn class="bg-white" flat :text-color="category==='switch' ? 'primary' : 'faded'" @click="category = 'switch'">
          <q-icon name="mdi-lightbulb"/>
          <span class="gt-sm q-ml-xs">Switch/Light</span>
        </q-btn>
        <q-btn class="bg-white" flat :text-color="category==='camera' ? 'primary' : 'faded'" @click="category = 'camera'">
          <q-icon name="mdi-camera"/>
          <span class="gt-sm q-ml-xs">Camera</span>
        </q-btn>
      </div>

      <q-space/>

      <div class="row q-gutter-x-xs">
        <q-btn flat dense class="bg-white" :text-color="showActivity ? 'primary' : 'faded'" icon="mdi-bell" @click="showActivity=!showActivity"/>
        <q-btn-dropdown class="bg-white" flat text-color="primary" :label="$q.screen.gt.xs ? 'create' : null" icon="add" dense>
          <q-list>
            <template v-for="cat in categories">
              <q-item-label header>{{ cat.name }}</q-item-label>
              <q-item v-close-popup v-for="type in cat.types" :key="type.type" clickable @click="create(type.type)">
                <q-item-section avatar>
                  <q-icon :name="$ethingUI.get(type.type).icon" :color="$ethingUI.get(type.type).color"/>
                </q-item-section>
                <q-item-section>{{ type.label }}</q-item-section>
              </q-item>
            </template>
          </q-list>
        </q-btn-dropdown>
      </div>
    </div>

    <div v-if="deviceFiltered.length" class="page-block row items-start" style="background: transparent;">
      <q-list class="col bg-white" :class="showActivity ? 'gt-sm q-mr-md' : ''">
          <resource-q-item v-for="(item, index) in deviceFiltered" :key="index" :resource="item.device" :level="item.level" no-parent />
      </q-list>

      <resource-activity v-if="showActivity" class="col-xs col-md-auto bg-white q-px-md" :source="deviceFiltered.map(item=>item.device)" />

    </div>

    <div v-else class="absolute-center text-center">
      <p>
        <img
          src="~assets/sad.svg"
          style="width:30vw;max-width:150px;"
        >
      </p>
      <p class="text-faded">No devices found</p>
    </div>

  </q-page>
</template>

<script>
import ResourceQItem from '../components/ResourceQItem'
import ResourceActivity from '../components/ResourceActivity'


export default {
  name: 'PageDevices',

  components: {
    ResourceQItem,
    ResourceActivity
  },

  data () {

    var categories = {}

    this.$ethingUI.iterate('resources', (resourceClsName) => {
      if (this.$ethingUI.isSubclass(resourceClsName, 'resources/Device')) {
        var resourceCls = this.$ethingUI.get(resourceClsName)
        if (!resourceCls.virtual && !resourceCls.disableCreation) {
          var path = (resourceCls.category || 'other').split('.')
          var label = resourceCls.title || resourceClsName.split('/').pop()
          var category = path[0]

          if (!categories[category]) {
            categories[category] = {
              types: []
            }
          }

          categories[category].types.push({
            label,
            type: resourceClsName
          })
        }
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
      category: '',
      showActivity: false
    }
  },

  computed: {
    devices () {
      return this.$ething.arbo.find(r => {
        return r instanceof this.$ething.Device
      })
    },

    listOrdered () {

      var list = []
      var self = this

      function getChildren(resource){
    		return self.$ething.arbo.find(function(r){
    			return r.createdBy() === resource.id() && (r instanceof self.$ething.Device)
    		});
    	}

    	function hasParent(resource){
        var createdById = resource.createdBy()
    		return createdById && self.$ething.arbo.get(createdById);
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
      this.$router.push({
        name: 'create',
        params: {
          type
        }
      })
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
