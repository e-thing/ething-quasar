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

      <resource-list
        :resources="deviceFiltered"
        tree
        class="col bg-white" :class="showActivity ? 'gt-sm q-mr-md' : ''"
        no-sort no-search
      />

      <resource-activity v-if="showActivity" class="col-xs col-md-auto bg-white q-px-md" :source="deviceFiltered" />

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
import ResourceList from '../components/ResourceList'
import ResourceActivity from '../components/ResourceActivity'


export default {
  name: 'PageDevices',

  components: {
    ResourceList,
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

    deviceFiltered () {
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
      return devices
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

  }
}
</script>
