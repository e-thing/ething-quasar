<template>
  <q-layout view="hHh Lpr lFf">
    <q-layout-header>
      <q-toolbar
        color="primary"
      >

        <q-btn class="xs" flat round dense icon="menu" @click="leftDrawerOpen = !leftDrawerOpen" aria-label="Toggle menu on left side" />

        <q-btn v-if="back" flat round dense icon="keyboard_backspace" @click="$router.go(-1)" aria-label="back" />

        <q-toolbar-title shrink >
          EThing
        </q-toolbar-title>

        <q-btn class="gt-xs" flat label="Dashboard" @click="$router.push('/dashboard')" />
        <q-btn class="gt-xs" flat label="Devices" @click="$router.push('/devices')" />
        <q-btn class="gt-xs" flat label="Data" @click="$router.push('/data')" />
        <q-btn class="gt-xs" flat label="Rules" @click="$router.push('/rules')" />

        <!--<q-btn-dropdown label="Data" flat content-style="color: #fff;background: #027be3;">
          <q-list link>
            <q-item v-close-overlay @click.native="$router.push('/data/tables')">
              <q-item-main>
                <q-item-tile label>Tables</q-item-tile>
              </q-item-main>
            </q-item>
            <q-item v-close-overlay @click.native="$router.push('/data/files')">
              <q-item-main>
                <q-item-tile label>Files</q-item-tile>
              </q-item-main>
            </q-item>
          </q-list>
        </q-btn-dropdown>-->

        <q-toolbar-title class="gt-xs"/>

        <q-btn v-if="refreshEnabled" class="gt-xs" flat dense icon="refresh" aria-label="refresh" @click="refresh"/>
        <q-btn class="gt-xs" flat dense icon="settings" aria-label="settings" @click="$router.push('/settings')"/>
        <q-btn v-if="!$ui.autoLogin" class="gt-xs" flat dense icon="exit to app" aria-label="logout" @click="logout" />

      </q-toolbar>

    </q-layout-header>

    <q-layout-drawer
      v-model="leftDrawerOpen"
      :content-class="$q.theme === 'mat' ? 'bg-grey-2' : null"
    >
      <q-list
        no-border
        link
        inset-delimiter
      >
        <q-list-header>Menu</q-list-header>
        <q-item @click.native="$router.push('/dashboard')">
          <q-item-side icon="dashboard" />
          <q-item-main label="Dashboard" />
        </q-item>
        <q-item @click.native="$router.push('/devices')">
          <q-item-side icon="devices" />
          <q-item-main label="Devices" />
        </q-item>
        <q-item @click.native="$router.push('/data')">
          <q-item-side icon="mdi-database" />
          <q-item-main label="Data" />
        </q-item>
        <q-item @click.native="$router.push('/rules')">
          <q-item-side icon="event" />
          <q-item-main label="Rules" />
        </q-item>

        <q-item-separator />

        <q-item @click.native="$router.push('/settings')">
          <q-item-side icon="settings" />
          <q-item-main label="Settings" />
        </q-item>
        <q-item v-if="!$ui.autoLogin" @click.native="logout">
          <q-item-side icon="exit to app" />
          <q-item-main label="Logout" />
        </q-item>

      </q-list>
    </q-layout-drawer>

    <q-page-container>
      <q-inner-loading v-if="$root.state!=='ok'" visible class="text-center">
        <div v-if="$root.state==='error'">
          <div class="q-pa-lg text-negative">
            {{ String($root.error) }}
          </div>
          <q-btn color="negative" icon="refresh" label="Reload" @click="reload"/>
        </div>
        <div v-else>
          <div class="q-pa-lg text-primary">loading...</div>
          <q-spinner-pie color="primary" size="50px" />
        </div>
      </q-inner-loading>
      <keep-alive v-else include="PageDashboard,PageDevices,PageData">
        <router-view/>
      </keep-alive>
      <v-keyboard v-if="vKeyboardEnabled"/>
    </q-page-container>
  </q-layout>
</template>

<script>

export default {
  name: 'LayoutDefault',
  data () {
    return {
      leftDrawerOpen: false // this.$q.platform.is.desktop
    }
  },
  computed: {
    back () {
      return this.$route.meta.back && (this.$q.platform.within.iframe || this.$q.platform.is.electron || this.$ui.kioskMode)
    },
    refreshEnabled () {
      return this.$q.platform.has.touch && (!this.$q.platform.is.desktop || this.$ui.kioskMode)
    },
    vKeyboardEnabled () {
      return this.$ui.virtualKeyboardEnabled
    }
  },
  methods: {
    logout () {
      this.$q.dialog({
        title: 'Logout ?',
        color: 'primary',
        message: 'Are you sure you want to logout ?',
        ok: 'Logout',
        cancel: 'Cancel'
      }).then(() => {
        this.$ui.logout()
      }).catch(() => {

      })
    },
    reload () {
      this.$root.state = 'begin'
      this.$router.go(this.$router.currentRoute)
    },
    refresh () {
      this.$router.go()
    }
  },

}
</script>

<style>
</style>
