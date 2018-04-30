<template>

  <div v-if="loading===false">
    <q-list>

      <q-list-header>General</q-list-header>

      <q-item link tag="label">
        <q-item-main label="Debug" />
        <q-item-side right>
          <q-toggle v-model="settings.debug" />
        </q-item-side>
      </q-item>

      <q-item>
        <q-item-side>Log Level</q-item-side>
        <q-item-main>
          <q-select hide-underline class="q-ma-none full-width" v-model="settings.log.level" :options="logLevels" />
        </q-item-main>
      </q-item>

    </q-list>

    <q-list class="q-mt-md">

      <q-list-header>Auth</q-list-header>

      <q-item link tag="label">
        <q-item-main>
          <q-item-tile label>Local only</q-item-tile>
          <q-item-tile sublabel>
            To restrict access to local ip only.
          </q-item-tile>
        </q-item-main>
        <q-item-side right>
          <q-toggle v-model="settings.auth.localonly" />
        </q-item-side>
      </q-item>

      <q-item>
        <q-item-main>
          <q-item-tile label>Login</q-item-tile>
          <q-input v-model="settings.auth.username"/>
        </q-item-main>
      </q-item>

      <q-item>
        <q-item-main>
          <q-item-tile label>Password</q-item-tile>
          <q-input type="password" v-model="settings.auth.password"/>
        </q-item-main>
      </q-item>
    </q-list>

    <q-list class="q-mt-md">

      <q-list-header>Notification</q-list-header>

      <q-item>
        <q-item-main>
          <q-item-tile label>Emails</q-item-tile>
          <q-chips-input v-model="settings.notification.emails" placeholder="emails"/>
        </q-item-main>
      </q-item>

      <q-item>
        <q-item-main>
          <q-list no-border class="q-mt-md">

            <q-list-header>SMTP server</q-list-header>

            <q-item>
              <q-item-main>
                <q-item-tile label>Host</q-item-tile>
                <q-input v-model="settings.notification.smtp.host" placeholder="smtp.gmail.com"/>
              </q-item-main>
            </q-item>

            <q-item>
              <q-item-main>
                <q-item-tile label>Port</q-item-tile>
                <q-input type="number" min="1" max="65535" v-model="settings.notification.smtp.port"/>
              </q-item-main>
            </q-item>

            <q-item>
              <q-item-main>
                <q-item-tile label>User</q-item-tile>
                <q-input v-model="settings.notification.smtp.user" placeholder="<username>@gmail.com"/>
              </q-item-main>
            </q-item>

            <q-item>
              <q-item-main>
                <q-item-tile label>Password</q-item-tile>
                <q-input type="password" v-model="settings.notification.smtp.password"/>
              </q-item-main>
            </q-item>
          </q-list>
        </q-item-main>
      </q-item>


    </q-list>

    <q-alert
        v-if="error"
        type="negative"
        class="q-mt-md"
    >
      {{ String(error) }}
    </q-alert>

    <div class="q-mt-md">
        <q-btn :loading="saving" color="primary" icon="done" label="save changes" @click="onSave"/>
    </div>

  </div>

  <div v-else>loading ...</div>

</template>

<script>

export default {
    name: 'SettingsView',

    data () {
        return {
          loading: true,
          saving: false,
          error: false,
          settings : {},
          logLevels: [
            {
              label: 'debug',
              value: 'debug'
            },
            {
              label: 'info',
              value: 'info'
            },
            {
              label: 'warning',
              value: 'warning'
            },
            {
              label: 'error',
              value: 'error'
            },
            {
              label: 'fatal',
              value: 'fatal'
            },
          ]
        }
    },

    methods: {

      load () {
        this.loading = true

        this.$ething.settings.get().done((settings) => {
          console.log(settings)

          if (!settings.notification.smtp) {
            settings.notification.smtp = {
              port: 587
            }
          }

          this.settings = settings
          this.loading = false
        })
      },

      onSave () {
        console.log(this.settings)

        this.saving = true

        this.$ething.settings.set(this.settings).fail(err => {
          this.error = err
        }).always(() => {
          this.saving = false
        })

      }

    },

    mounted () {
      this.load()
    }

}
</script>
