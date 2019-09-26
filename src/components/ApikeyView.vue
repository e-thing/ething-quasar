<template>
  <div class="center-width-md q-gutter-y-md q-py-md q-px-sm">
    <template v-if="loading===false">

      <div class="bg-white q-pa-md">
        Control your EThing instance via the <a href="https://ething.readthedocs.io/en/latest/http_api.html" target="_blank">HTTP API</a>.
      </div>

      <div>
        <q-btn icon="add" label="API key" color="secondary" @click="create()"/>
      </div>

      <div class="bg-white q-pa-md" v-if="apikeys.length > 0">
        <div class="item row items-center q-gutter-x-sm">
          <div class="name col-xs-2 col-sm-2 col-md-2 text-secondary ellipsis">
            name
          </div>
          <div class="date col-xs-0 col-sm-0 col-md-2 text-secondary ellipsis">
            date
          </div>
          <div class="key col col-sm-5 col-md-5 col-lg-5 text-secondary">
            value
          </div>
          <div class="scope col gt-xs text-secondary">
            scope
          </div>
        </div>

        <div class="item row items-center q-gutter-x-sm q-mt-md" v-for="apikey in apikeys" :key="apikey.id">
          <div class="date col-xs-2 col-sm-2 col-md-2 text-faded ellipsis">
            {{ apikey.name }}
          </div>
          <div class="date col-xs-0 col-sm-0 col-md-2 text-faded ellipsis">
            {{ $ethingUI.utils.dateToString(apikey.modifiedDate) }}
          </div>
          <div class="key col col-sm-5 col-md-5 col-lg-5">
            {{ apikey.value }}
          </div>
          <div class="scope col gt-xs text-faded ellipsis">
            <div v-for="scope in splitScopes(apikey.scope)">
              {{ scope }}
            </div>
          </div>
          <div class="controls col-auto">
            <q-btn icon="settings" round flat dense color="faded" @click="edit(apikey)"/>
            <q-btn icon="delete" round flat dense color="negative" @click="remove(apikey)"/>
          </div>
        </div>
      </div>
    </template>
    <div v-else>loading ...</div>


    <modal v-model="modal" :title="editing ? 'Edit API key' : 'Create a new API key'" icon="mdi-key" :valid-btn-label="editing ? 'Edit' : 'Create'" cancel-btn-label="Cancel" :valid-btn-disable="error || addLoading" @valid="add">

      <form-schema :key="formKey" :schema="schema" v-model="model" @error="error = $event"/>

      <q-banner
          v-if="serverError"
          class="bg-negative text-white q-mb-xl"
      >
        <q-icon left name="mdi-alert"/> {{ String(serverError) }}
      </q-banner>

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
          formKey: 0,
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
                '$component': 'scope',
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
        this.formKey++
      },

      add () {

        var apikey = Object.assign({}, this.model)

        this.addLoading = true
        this.serverError = false

        EThing.request({
          method: this.editing ? 'PATCH' : 'POST',
          url: this.editing ? ('apikey/'+this.editing.id) : 'apikey',
          dataType: 'json',
          data: apikey
        }).then((apikey) => {

          var apikeys = this.apikeys || []

          var replaced = false
          for (var i in apikeys) {
            if (apikeys[i].id == apikey.id) {
              apikeys[i] = apikey
              replaced = true
              break
            }
          }

          if (!replaced) {
            apikeys.push(apikey)
          }

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

      splitScopes (scopes) {
        return scopes.split(' ')
      }

    },

    mounted () {
      this.load()
    }

}
</script>
