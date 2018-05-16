<template>
  <div class="fixed-center content">
    <div class="q-display-3 text-primary text-center">EThing</div>

    <div class="q-pb-md">
      <q-field
        v-if="$ui.dynamicServerUrl"
        :error="$v.server.$error"
        error-label="required"
      >
        <q-input
          class="q-py-md"
          ref="server"
          autofocus
          v-model="server"
          float-label="Server Url"
          @keyup.enter="$refs.login.focus()"
          @blur="$v.server.$touch"
        />
      </q-field>
      <q-field
        :error="$v.form.login.$error"
        error-label="Login is required"
      >
        <q-input
          class="q-py-md"
          ref="login"
          autofocus
          v-model="form.login"
          float-label="Login"
          @keyup.enter="$refs.password.focus()"
          @blur="$v.form.login.$touch"
        />
      </q-field>
      <q-field
        :error="$v.form.password.$error"
        error-label="Password is required"
      >
        <q-input
          class="q-py-md"
          ref="password"
          v-model="form.password"
          type="password"
          float-label="Password"
          @keyup.enter="onConnect"
          @blur="$v.form.password.$touch"
          :error="$v.form.password.$error"
        />
      </q-field>
    </div>

    <q-btn :loading="loading" :disable="$v.$error" color="primary" class="full-width" @click="onConnect">Connect</q-btn>

  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'

var defaultServerUrl = 'http://localhost:8000'

export default {
  name: 'PageLogin',

  data () {

    return {
      loading: false,
      server: this.$ui.getServerUrl() || defaultServerUrl,
      form: {
        login: '',
        password: ''
      }
    }
  },

  validations () {
    var v = {
      form: {
        login: { required },
        password: { required  }
      }
    }

    if (this.$ui.dynamicServerUrl) {
      v.server = {
        required
      }
    }

    return v
  },

  methods: {
    onConnect () {
      this.$v.$touch()

      if (this.$v.$error) {
        return
      }

      this.loading = true
      var server = this.server.trim().replace(/\/+$/, '')

      this.$ui.login(server, this.form.login, this.form.password).catch(error => {

        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          var status = error.response.status

          if (status == 401 || status == 403) {
						this.$q.notify('Invalid credentials.')
					}
          else {
            this.$q.notify('Could not authenticate.')
          }


        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          this.$q.notify('Unable to access to the EThing server at ' + server)

        } else {
          // Something happened in setting up the request that triggered an Error
          this.$q.notify('Error', error.message)
        }

      }).finally(() => {
        this.loading = false
      })

    }
  }
}
</script>

<style>
.content {
  width: 300px;
}
</style>
