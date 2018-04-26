<template>
  <div class="fixed-center">
    <div class="q-display-3 text-primary text-center">EThing</div>

    <div class="q-pb-md">
      <q-field
        :error="$v.form.login.$error"
        error-label="Login is required"
      >
        <q-input
          class="q-py-md"
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

    <q-btn :loading="loading" color="primary" class="full-width" @click="onConnect">Connect</q-btn>

  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'

export default {
  name: 'PageLogin',

  data () {
    return {
      loading: false,
      form: {
        login: '',
        password: ''
      }
    }
  },

  validations: {
    form: {
      login: { required },
      password: { required  }
    }
  },

  methods: {
    onConnect () {
      this.$v.form.$touch()

      if (this.$v.form.$error) {
        this.$q.notify('Invalid credentials.')
        return
      }

      var xhr = new XMLHttpRequest()
      var self = this

      this.loading = true

      xhr.open("POST", this.$ething.config.serverUrl + '/auth/password', true);

      xhr.withCredentials = true
			xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

			xhr.onreadystatechange = function() {
				if (this.readyState == 4){
          self.loading = false

					/*var data = this.responseText

					if(/json/.test(this.getResponseHeader("Content-Type") || '')){
						data = JSON.parse(data);
					}*/

					if(this.status >= 200 && this.status < 400) {
						// redirect
						self.$router.replace(self.$route.query.redirect_uri || '/')
					}
					else if (this.status == 401 || this.status == 403) {
						self.$q.notify('Invalid credentials.')
					}
          else {
            self.$q.notify('Could not authenticate.')
          }
				}
        self.loading = false
			}

      xhr.onerror = function () {
        self.loading = false
        self.$q.notify('Unable to access to the EThing server ' + self.$ething.config.serverUrl)
      }

			xhr.send('login='+encodeURIComponent(this.form.login)+'&password='+encodeURIComponent(this.form.password))

    }
  }
}
</script>

<style>
</style>
