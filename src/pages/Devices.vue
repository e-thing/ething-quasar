<template>
  <q-page class="page page-width-lg">
    
    <div class="row items-start page-block" style="background: transparent;">

      <resource-list
        class="col bg-white"
        :class="showActivity ? 'gt-sm q-mr-md' : ''"
        resources="resources/Device"
        tree
        :categories="['interfaces/Sensor', 'interfaces/Switch', 'interfaces/Camera']"
        empty-message="No devices found"
        @changed="devices = $event"
      >
        <template v-slot:header-right>
          <q-btn flat :dense="$q.screen.lt.lg" :text-color="showActivity ? 'primary' : 'light'" icon="mdi-bell" @click="showActivity=!showActivity"/>
        </template>
      </resource-list>

      <resource-activity v-if="showActivity" class="col-xs col-md-auto bg-white q-px-md" :source="devices" />
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
    return {
      showActivity: false,
      devices: []
    }
  },
}
</script>
