<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated>
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
        <q-btn class="gt-xs" flat label="Flows" @click="$router.push('/flows')" />

        <q-toolbar-title class="gt-xs"/>

        <q-btn v-if="refreshEnabled" class="gt-xs" flat icon="refresh" aria-label="refresh" @click="refresh"/>
        <q-btn class="gt-xs" flat icon="settings" aria-label="Settings" @click="$router.push('/settings')"/>
        <q-btn v-if="!$ethingUI.autoLogin" class="gt-xs" flat icon="exit_to_app" aria-label="Logout" @click="logout" />

      </q-toolbar>

    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      content-class="bg-grey-2"
    >
      <q-list
        inset-delimiter
      >
        <q-item-label header>Menu</q-item-label>
        <q-item clickable @click="$router.push('/dashboard')">
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>Dashboard</q-item-section>
        </q-item>
        <q-item clickable @click="$router.push('/devices')">
          <q-item-section avatar>
            <q-icon name="devices" />
          </q-item-section>
          <q-item-section>Devices</q-item-section>
        </q-item>
        <q-item clickable @click="$router.push('/data')">
          <q-item-section avatar>
            <q-icon name="mdi-database" />
          </q-item-section>
          <q-item-section>Data</q-item-section>
        </q-item>
        <q-item clickable @click="$router.push('/flows')">
          <q-item-section avatar>
            <q-icon name="mdi-ray-start-arrow" />
          </q-item-section>
          <q-item-section>Flows</q-item-section>
        </q-item>

        <q-separator />

        <q-item clickable @click="$router.push('/settings')">
          <q-item-section avatar>
            <q-icon name="settings" />
          </q-item-section>
          <q-item-section>Settings</q-item-section>
        </q-item>
        <q-item v-if="!$ethingUI.autoLogin" clickable @click="logout">
          <q-item-section avatar>
            <q-icon name="exit_to_app" />
          </q-item-section>
          <q-item-section>Logout</q-item-section>
        </q-item>

      </q-list>
    </q-drawer>

    <q-page-container>
      <q-inner-loading v-if="$root.state!=='ok'" showing class="text-center">
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
      return this.$route.meta.back && (this.$q.platform.within.iframe || this.$q.platform.is.electron || this.$ethingUI.kioskMode)
    },
    refreshEnabled () {
      return this.$q.platform.has.touch && (!this.$q.platform.is.desktop || this.$ethingUI.kioskMode)
    },
    vKeyboardEnabled () {
      return this.$ethingUI.virtualKeyboardEnabled
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
      }).onOk(() => {
        this.$ethingUI.logout()
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
