<template>
  <div>
    <div v-if="loading===false">

      <div v-if="clients.length > 0">

        <q-card v-for="client in clients" :key="client.id">
          <q-card-title>
            {{ client.ip}}
            <small v-if="isCurrent(client)" class="text-faded">(current)</small>
            <div slot="right" class="row items-center">
              <q-icon name="mdi-checkbox-blank-circle" :color="client.online ? 'green' : 'red'"></q-icon>
            </div>
          </q-card-title>
          <q-card-main class="text-faded">
            <div>online: {{ client.online }}</div>
            <div>platform: {{ client.platform }}</div>
            <div>browser: {{ client.browser }}</div>
          </q-card-main>
          <q-card-actions>
            <q-btn flat color="primary" label="Identify" @click="notify(client, 'hello !')"/>
            <q-btn flat color="faded" label="Remove" @click="remove(client)"/>
          </q-card-actions>
        </q-card>

      </div>
      <div v-else class="absolute-center text-faded">No API keys</div>
    </div>
    <div v-else>loading ...</div>

  </div>

</template>

<script>
import { LocalStorage } from 'quasar'

export default {
    name: 'ApikeyView',

    data () {
        return {
          loading: true,
          clients: []
        }
    },

    methods: {

      isCurrent(client) {
        return client.id === LocalStorage.get.item('ething.cid')
      },

      load () {
        this.loading = true

        EThing.request({
          url: 'clients',
          dataType: 'json',
        }).then((clients) => {

          this.clients = clients
          this.loading = false

        }).catch(err => {
          console.error(err)
        })
      },

      remove (client) {
        EThing.request({
          method: 'DELETE',
          url: 'clients/' + client.id
        }).then(() => {

          var index = this.clients.findIndex(item => item.id === client.id)

          if (index !== -1) {
            this.clients.splice(index, 1)
          }

        }).catch(err => {
          console.error(err)
        })
      },

      notify (client, msg) {
        EThing.request({
          method: 'POST',
          url: 'clients/' + client.id + '/notify',
          contentType: "application/json; charset=utf-8",
          data: {msg}
        })
      },

    },

    mounted () {
      this.load()
    }

}
</script>
