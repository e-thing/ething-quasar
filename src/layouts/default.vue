<template>
  <q-layout view="hHh Lpr lFf">
    <q-layout-header>
      <q-toolbar
        color="primary"
      >

        <q-btn class="xs" flat round dense icon="menu" @click="leftDrawerOpen = !leftDrawerOpen" aria-label="Toggle menu on left side" />

        <q-toolbar-title shrink >
          EThing
        </q-toolbar-title>

        <q-btn class="gt-xs" flat label="Dashboard" @click="$router.push('/dashboard')" />
        <q-btn class="gt-xs" flat label="Devices" @click="$router.push('/devices')" />
        <q-btn class="gt-xs" flat label="Data" @click="$router.push('/data')" />

        <q-toolbar-title class="gt-xs"/>

        <q-btn class="gt-xs" flat dense icon="settings" aria-label="settings" />
        <q-btn class="gt-xs" flat dense icon="exit to app" aria-label="logout" />

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

        <q-item-separator />

        <q-item @click.native="$router.push('/settings')">
          <q-item-side icon="settings" />
          <q-item-main label="Settings" />
        </q-item>
        <q-item @click.native="$router.push('/logout')">
          <q-item-side icon="exit to app" />
          <q-item-main label="Logout" />
        </q-item>

      </q-list>
    </q-layout-drawer>

    <q-page-container>
      <q-inner-loading v-if="$root.loading" visible class="text-center">
        <div v-if="$root.error">
          <div class="q-pa-lg text-negative">
            {{ String($root.error) }}
          </div>
          <q-btn color="negative" icon="refresh" label="Reload" @click="$router.go($router.currentRoute)"/>
        </div>
        <div v-else>
          <div class="q-pa-lg text-primary">loading...</div>
          <q-spinner-pie color="primary" size="50px" />
        </div>
      </q-inner-loading>
      <router-view v-else/>
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'

export default {
  name: 'LayoutDefault',
  data () {
    return {
      leftDrawerOpen: false // this.$q.platform.is.desktop
    }
  },
  methods: {
    openURL
  }
}
</script>

<style>
</style>
