<template>
  <div>
    <div v-if="loading===false">

      <div class="q-my-md">
        <q-btn icon="add" label="new API key" rounded color="secondary" @click="create()"/>
      </div>

      <div v-if="apikeys.length > 0">

        <div class="item row items-center gutter-x-sm">
          <div class="date col-xs-5 col-sm-4 col-md-3 text-secondary ellipsis">
            date
          </div>
          <div class="key col text-secondary">
            value
          </div>
        </div>

        <div class="item row items-center gutter-x-sm" v-for="apikey in apikeys" :key="apikey.id">
          <div class="date col-xs-5 col-sm-4 col-md-3 text-faded ellipsis">
            {{ $ui.dateToString(apikey.modifiedDate) }}
          </div>
          <div class="key col">
            {{ apikey.value }}
          </div>
          <div class="controls col-auto">
            <q-btn icon="settings" round flat dense color="faded" @click="edit(apikey)"/>
            <q-btn icon="delete" round flat dense color="negative" @click="remove(apikey)"/>
          </div>
        </div>
      </div>
      <div v-else class="absolute-center text-faded">No API keys</div>
    </div>
    <div v-else>loading ...</div>


    <modal v-model="modal" :title="editing ? 'Edit API key' : 'Create a new API key'" icon="mdi-key" :valid-btn-label="editing ? 'Edit' : 'Create'" cancel-btn-label="Cancel" :valid-btn-disable="error || addLoading" @valid="add">

      <form-schema :schema="schema" v-model="model" @error="error = $event"/>

      <q-alert
          v-if="serverError"
          type="negative"
          class="q-mb-xl"
      >
        {{ String(serverError) }}
      </q-alert>

    </modal>
  </div>

</template>

<script>

export default {
    name: 'ApikeyView',

    data () {

        return {
          loading: true,
          apikeys: [],
          schema: {
            type: 'object',
            additionalProperties: false,
            required: ["name"],
            properties: {
              name: {
                type: 'string',
                minLength: 1
              },
              scope: {
                type: 'string',
                format: 'scope',
                default: ''
              }
            }
          },
          model: {},
          error: false,
          modal: false,
          addLoading: false,
          serverError: false,
          editing: false
        }
    },

    methods: {

      load () {
        this.loading = true

        EThing.request({
          url: 'apikey',
          dataType: 'json',
        }).then((apikeys) => {

          this.apikeys = apikeys
          this.loading = false

        }).catch(err => {
          console.error(err)
        })
      },

      reset () {
        this.serverError = false
        this.error = false
        this.model = {}
        this.editing = false
      },

      add () {

        var apikey = Object.assign({}, this.model)

        this.addLoading = true
        this.serverError = false

        console.log(apikey)

        EThing.request({
          method: this.editing ? 'PATCH' : 'POST',
          url: this.editing ? ('apikey/'+this.editing.id) : 'apikey',
          dataType: 'json',
          data: apikey
        }).then((apikey) => {

          var apikeys = this.apikeys || []

          apikeys.push(apikey)
          this.apikeys = apikeys

          this.modal = false

        }).catch(err => {
          this.serverError = err
        }).finally(() => {
          this.addLoading = false
        })

      },

      create () {
        this.reset()
        this.modal = true
      },

      edit (apikey) {
        this.reset()
        this.model = Object.assign({}, apikey)
        this.editing = apikey
        this.modal = true
      },

      remove (apikey) {
        EThing.request({
          method: 'DELETE',
          url: 'apikey/' + apikey.id
        }).then(() => {

          var index = this.apikeys.findIndex(item => item.id === apikey.id)

          if (index !== -1) {
            this.apikeys.splice(index, 1)
          }

        }).catch(err => {
          console.error(err)
        })
      },

    },

    mounted () {
      this.load()
    }

}
</script>
