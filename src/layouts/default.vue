<template>
  <q-layout view="hHh LpR fFf" class="bg-grey-1">
    <q-header elevated height-hint="50">
      <q-toolbar
        color="primary"
        class="q-px-none"
      >
        <q-btn flat icon="menu" @click="leftDrawerOpen = !leftDrawerOpen" aria-label="Menu" stretch/>

        <q-btn v-if="back" flat round dense icon="keyboard_backspace" @click="$router.go(-1)" aria-label="back" />

        <q-btn flat no-caps no-wrap class="q-ml-xs" v-if="$q.screen.gt.xs" stretch @click="$router.push('/')">
          <q-icon name="img:statics/app-logo-128x128.png" size="28px" />
          <q-toolbar-title shrink class="text-weight-bold">
            EThing
          </q-toolbar-title>
        </q-btn>

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
        <q-btn class="gt-xs" flat stretch icon="settings" aria-label="Settings" @click="$router.push({name: 'system', params: {panel: 'settings'}})"/>
        <q-btn v-if="!$ethingUI.autoLogin" class="gt-xs" flat stretch icon="exit_to_app" aria-label="Logout" @click="logout" />

      </q-toolbar>

    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      content-class="bg-grey-2"
      show-if-above
      bordered
      :width="240"
    >
      <q-scroll-area class="fit">
        <q-list
          padding
        >

          <q-item v-ripple clickable @click="$router.push('/dashboard')">
            <q-item-section avatar>
              <q-icon color="grey-7" name="dashboard" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Dashboard</q-item-label>
            </q-item-section>
          </q-item>

          <q-item v-ripple clickable @click="$router.push({name:'explore', query:{resources: 'resources/Flow'}})">
            <q-item-section avatar>
              <q-icon color="grey-7" name="mdi-ray-start-arrow" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Flows</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="q-mt-md q-mb-xs" />

          <q-item v-ripple clickable @click="$router.push({name:'explore', query:{resources: 'resources/Device'}})">
            <q-item-section avatar>
              <q-icon color="grey-7" name="devices" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Devices</q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            v-ripple
            clickable
            dense
            v-for="(cat, index) in __categories" :key="index"
            class="text-grey-8 text-weight-light sub"
            @click="$router.push({name:'explore', query:{resources: cat._type}})"
          >
            <q-item-section avatar>
              <q-icon :name="cat.icon" color="grey-5"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ cat.title }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="q-mt-md q-mb-xs" />

          <q-item-label header class="text-weight-bold text-uppercase">
            Data
          </q-item-label>

          <q-item v-ripple clickable @click="$router.push({name:'explore', query:{resources: 'resources/Table'}})">
            <q-item-section avatar>
              <q-icon color="grey-7" name="mdi-table-large" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Tables</q-item-label>
            </q-item-section>
          </q-item>

          <q-item v-ripple clickable @click="$router.push({name:'explore', query:{resources: 'resources/File'}})">
            <q-item-section avatar>
              <q-icon color="grey-7" name="mdi-file" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Files</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="q-mt-md q-mb-xs" />

          <q-item clickable @click="$router.push({name:'system', params: {panel: 'settings'}})" v-ripple>
            <q-item-section avatar>
              <q-icon color="grey-7" name="settings" />
            </q-item-section>
            <q-item-section>Settings</q-item-section>
          </q-item>
          <q-item v-if="!$ethingUI.autoLogin" clickable @click="logout" v-ripple>
            <q-item-section avatar>
              <q-icon color="grey-7" name="exit_to_app" />
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
      <keep-alive v-else include="PageDashboard">
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
      persistentNotifications: this.$ethingUI.persistentNotifications,
      categories: ['interfaces/Sensor', 'interfaces/Switch', 'interfaces/Camera']
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
    },
    __categories () {
      if (this.$root.state==='ok') {
        return this.categories.map(t => {
          return this.$ethingUI.get(t)
        })
      }
      return []
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

<style scoped>
.sub {
    border-radius: 0 10px 10px 0;
    margin-right: 12px;
}
</style>
