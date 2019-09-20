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

        <q-btn class="gt-xs" flat stretch label="Dashboard" @click="$router.push('/dashboard')" />
        <q-btn class="gt-xs" flat stretch label="Devices" @click="$router.push('/devices')" />
        <q-btn class="gt-xs" flat stretch label="Data" @click="$router.push('/data')" />
        <q-btn class="gt-xs" flat stretch label="Flows" @click="$router.push('/flows')" />
        <q-btn class="gt-xs" flat stretch label="Accounts" @click="$router.push('/accounts')" />

        <q-space />

        <q-btn v-if="refreshEnabled" stretch class="gt-xs" flat icon="refresh" aria-label="refresh" @click="refresh"/>
        <q-btn flat icon="mdi-bell" stretch>
          <q-badge v-if="persistentNotifications.length>0" color="red" floating style="top: 4px;right: 3px;">{{ persistentNotifications.length }}</q-badge>
          <q-menu
            anchor="bottom right"
            self="top right"
            max-width="370px"
            square
            content-class="no-shadow bg-transparent"
            transition-show="slide-down"
            transition-hide="slide-up"
          >
            <div class="bg-grey-8 text-grey-5 q-pa-md text-subtitle2">{{ persistentNotifications.length>0 ? 'Notifications' : 'No notifications' }}</div>
            <q-scroll-area style="height: 50vh; min-width: 350px;" v-close-popup v-if="persistentNotifications.length>0">
              <q-list separator dark class="bg-primary text-white">
                  <q-item
                    v-for="(notification, index) in persistentNotifications"
                    :key="index"
                    clickable
                    @click="notification.open()"
                    v-close-popup
                    :class="notification.color ? 'bg-'+notification.color : 'bg-secondary'"
                  >
                    <q-item-section>
                      <q-item-label>
                        <q-icon :name="notification.icon || 'mdi-android-messages'" class="q-mr-sm"/> {{ notification.title || notification.mode }}
                        <span v-if="notification.resource" class="text-italic"> - {{ notification.resource.basename() }}</span>
                      </q-item-label>
                      <q-item-label caption>{{ notification.message }}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-btn round flat icon="close" @click.prevent.stop="notification.remove()"/>
                    </q-item-section>
                  </q-item>
              </q-list>
            </q-scroll-area>
          </q-menu>
        </q-btn>
        <q-btn class="gt-xs" flat stretch icon="settings" aria-label="Settings" @click="$router.push('/settings')"/>
        <q-btn v-if="!$ethingUI.autoLogin" class="gt-xs" flat stretch icon="exit_to_app" aria-label="Logout" @click="logout" />

      </q-toolbar>

    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      content-class="bg-grey-2"
      overlay
    >
      <div class="absolute-top bg-primary q-px-md q-py-lg row items-center q-gutter-md">
        <q-avatar size="56px" class="bg-white col-auto">
          <img src="statics/app-logo-128x128.png">
        </q-avatar>
        <div class="text-h4 text-white col">EThing</div>
      </div>

      <q-scroll-area style="height: calc(100% - 120px); margin-top: 120px">
        <q-list
          inset-delimiter
        >
          <q-item-label header>Menu</q-item-label>
          <q-item clickable @click="$router.push('/dashboard')" v-ripple>
            <q-item-section avatar>
              <q-icon name="dashboard" />
            </q-item-section>
            <q-item-section>Dashboard</q-item-section>
          </q-item>
          <q-item clickable @click="$router.push('/devices')" v-ripple>
            <q-item-section avatar>
              <q-icon name="devices" />
            </q-item-section>
            <q-item-section>Devices</q-item-section>
          </q-item>
          <q-item clickable @click="$router.push('/data')" v-ripple>
            <q-item-section avatar>
              <q-icon name="mdi-database" />
            </q-item-section>
            <q-item-section>Data</q-item-section>
          </q-item>
          <q-item clickable @click="$router.push('/flows')" v-ripple>
            <q-item-section avatar>
              <q-icon name="mdi-ray-start-arrow" />
            </q-item-section>
            <q-item-section>Flows</q-item-section>
          </q-item>
          <q-item clickable @click="$router.push('/accounts')" v-ripple>
            <q-item-section avatar>
              <q-icon name="mdi-account" />
            </q-item-section>
            <q-item-section>Accounts</q-item-section>
          </q-item>

          <q-separator />

          <q-item clickable @click="$router.push('/settings')" v-ripple>
            <q-item-section avatar>
              <q-icon name="settings" />
            </q-item-section>
            <q-item-section>Settings</q-item-section>
          </q-item>
          <q-item v-if="!$ethingUI.autoLogin" clickable @click="logout" v-ripple>
            <q-item-section avatar>
              <q-icon name="exit_to_app" />
            </q-item-section>
            <q-item-section>Logout</q-item-section>
          </q-item>

        </q-list>
      </q-scroll-area>
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
      leftDrawerOpen: false, // this.$q.platform.is.desktop
      persistentNotifications: this.$ethingUI.persistentNotifications
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
