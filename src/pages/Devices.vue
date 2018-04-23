<template>
  <q-page>
    <div v-if="devices.length">
      <q-list link no-border>

          <q-item v-for="device in devices" :key="device.id()" :to="'/device/' + device.id()">
            <q-item-side :icon="$ething.meta.get(device).icon" inverted :color="$ething.meta.get(device).color" />
            <q-item-main>
              <q-item-tile label>{{ device.basename() }}</q-item-tile>
              <q-item-tile sublabel>{{ dateToString(device.modifiedDate()) }}</q-item-tile>
              <q-item-tile sublabel>{{ device.type() }}</q-item-tile>
            </q-item-main>
            <q-item-side right icon="delete" color="negative" @click.native.stop="onRemoveClick(device)"/>
            <q-item-side right icon="settings" @click.native.stop="settingsClick(device)"/>
          </q-item>

      </q-list>
    </div>

    <div v-else class="q-pa-md">
    No items found.
    </div>

  </q-page>
</template>

<script>
import { date } from 'quasar'

export default {
  name: 'PageDevices',

  data () {
    return {}
  },

  computed: {
    devices () {
      return this.$store.getters['ething/filter'](r => {
        return r instanceof this.$ething.Device
      })
    }
  },

  methods: {
    dateToString (d) {
      var ts = d.getTime()
      return date.formatDate(ts, 'YYYY-MM-DD HH:mm')
    },

    settingsClick (resource) {
      this.$router.push('/resource/' + resource.id())
    },

    onRemoveClick (resource) {
      this.$q.dialog({
        title: 'Remove',
        message: 'Do you really want to remove definitely the ' + resource.type() + ' "' + resource.name() + '" ?',
        options: {
          type: 'checkbox',
          model: [],
          items: [
            {label: 'Remove also the children resources', value: 'removeChildren', color: 'secondary'},
          ]
        },
        ok: 'Remove',
        cancel: 'Cancel'
      }).then((data) => {
        resource.remove(data.indexOf('removeChildren') !== -1).done( () => {
          this.$q.notify('Removed !')
        })
      })
    }
  }
}
</script>

<style>
</style>
