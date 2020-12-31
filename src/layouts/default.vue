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

          <q-item v-ripple clickable :to="{name:'dashboard'}">
            <q-item-section avatar>
              <q-icon name="dashboard" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Dashboard</q-item-label>
            </q-item-section>
          </q-item>

          <template
            v-if="dashboardTitles.length>1"
          >
            <q-item
              v-for="(title, index) in dashboardTitles" :key="'dashboard' + index"
              v-ripple clickable
              dense
              class="sub"
              :to="{name:'dashboard', query:{index: index}}" exact
            >
              <q-item-section avatar></q-item-section>
              <q-item-section>
                <q-item-label :lines="1">{{ title }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-separator class="q-mt-md q-mb-xs" />

          </template>

          <q-item v-ripple clickable :to="{name:'explore', query:{resources: 'resources/Flow'}}" exact>
            <q-item-section avatar>
              <q-icon name="mdi-ray-start-arrow" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Flows</q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            v-for="(item, index) in __rootItems" :key="'menu-'+index"
            v-ripple clickable
            :to="item.route" exact
          >
            <q-item-section avatar>
              <q-icon :name="item.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ item.label }}</q-item-label>
            </q-item-section>
          </q-item>

          <template
            v-for="(menu, index) in __rootSubMenus"
          >
            <q-separator class="q-mt-md q-mb-xs" />

            <q-item-label header class="text-weight-bold text-uppercase">
              {{ menu.label }}
            </q-item-label>

            <q-item
              v-for="(item, i) in menu.items" :key="'submenu-'+index+'-'+i"
              v-ripple clickable
              :to="item.route" exact
              dense
              class="sub"
            >
              <q-item-section avatar>
                <q-icon :name="item.icon" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ item.label }}</q-item-label>
              </q-item-section>
            </q-item>

          </template>

          <q-separator class="q-mt-md q-mb-xs" />

          <q-item-label header>
            <span class="text-weight-bold text-uppercase">
              Devices
            </span>
            <span class="text-right cursor-pointer float-right" style="font-size: x-small;">
              {{ devicesMenuSortMode }} <q-icon name="arrow_drop_down" />

              <q-menu anchor="bottom right" self="top right">
                <q-list dense>
                  <q-item v-for="v in ['type', 'location']" clickable v-close-popup @click="devicesMenuSortMode=v">
                    <q-item-section>{{v}}</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </span>

          </q-item-label>

          <q-item
            v-ripple
            clickable
            dense
            class="sub"
            :inset-level="1"
            :to="{name:'explore', query:{deviceMenu: 'all'}}"
            exact
          >
            <q-item-section>
              <q-item-label>All</q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-badge color="primary" :label="__devicesLen" />
            </q-item-section>
          </q-item>

          <q-item
            v-ripple
            clickable
            dense
            v-for="(item, index) in __deviceItems" :key="'device-'+index"
            v-if="item.len>0"
            class="sub"
            :to="{name:'explore', query: item.query}"
            exact
            :inset-level="item.icon ? 0 : 1"
          >
            <q-item-section avatar v-if="item.icon">
              <q-icon :name="item.icon"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ item.label }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-badge color="primary" :label="item.len" />
            </q-item-section>
          </q-item>

          <q-separator class="q-mt-md q-mb-xs" />

          <q-item-label header class="text-weight-bold text-uppercase">
            Data
          </q-item-label>

          <q-item v-ripple clickable dense class="sub" :to="{name:'explore', query:{resources: 'resources/Table'}}" exact>
            <q-item-section avatar>
              <q-icon name="mdi-table-large" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Tables</q-item-label>
            </q-item-section>
          </q-item>

          <q-item v-ripple clickable dense class="sub" :to="{name:'explore', query:{resources: 'resources/File'}}" exact>
            <q-item-section avatar>
              <q-icon name="mdi-file" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Files</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator class="q-mt-md q-mb-xs lt-sm" />

          <q-item clickable :to="{name:'system'}" v-ripple exact class="lt-sm">
            <q-item-section avatar>
              <q-icon name="settings" />
            </q-item-section>
            <q-item-section>Settings</q-item-section>
          </q-item>
          <q-item v-if="!$ethingUI.autoLogin" clickable @click="logout" v-ripple class="lt-sm">
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
      <router-view v-else/>
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
      dashboardTitles: [],
      devicesMenuSortMode: 'location',
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
    __devices () {
      return this.$ethingUI.resource.listFromTypes('resources/Device')
    },
    __devicesLen () {
      return this.__devices.length
    },
    __deviceItems () {
      if (this.devicesMenuSortMode=='location') {
        var locations = {}
        this.__devices.forEach((dev, i) => {
          var location = dev.location()
          if (!locations[location]) {
            locations[location] = {
              label: location,
              len: 0,
              icon: 'chevron_right',
              query: {
                deviceLocation: location
              }
            }
          }
          locations[location].len++
        });
        return Object.values(locations)
      } else {
        return this.$ethingUI.menu.devices.map((item, i) => {
          var len = this.$ethingUI.resource.listFromTypes(item.types).length
          return Object.assign({
            len,
            query: {
              deviceMenu: i
            }
          }, item)
        })
      }
    },
    __rootItems () {
      return this.$ethingUI.menu.root.filter(item => !item.parent)
    },
    __rootSubMenus () {
      var submenus = []
      this.$ethingUI.menu.root.filter(item => item.parent).forEach(item => {
        var submenu = null;
        for (var i in submenus) {
          if (submenus[i].label === item.parent) {
            submenu = submenus[i]
            break
          }
        }
        if (!submenu) {
          submenu = {
            label: item.parent,
            items: []
          }
          submenus.push(submenu)
        }

        submenu.items.push(item)
      })
      return submenus
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
    },
    updateDashboardItems () {
      try {
        this.dashboardTitles = this.$ethingUI.dashboard.config.dashboards.map(d => d.options.title)
      } catch(e) {
        this.dashboardTitles = []
      }
    }
  },

  mounted () {
    this.$ethingUI.on('ui.dashboard.config', this.updateDashboardItems)
    this.updateDashboardItems()
  },

  beforeDestroy () {
    this.$ethingUI.off('ui.dashboard.config', this.updateDashboardItems)
  }

}
</script>

<style lang="stylus" scoped>


light-primary = lightness($primary, (1 - 0.85) * lightness($primary) + 0.85 * 100)

.sub {
    border-radius: 0 10px 10px 0;
    margin-right: 12px;
}

.q-item:not(.sub)
  .q-icon
    color: $grey-7

  &.q-router-link--active
    color: $primary
    font-weight: 700
    .q-icon
      color: $primary

.q-item.sub
  color: $grey-8
  font-weight: 300
  .q-icon
    color: $grey-5;

  &.q-router-link--active
    color: $primary
    background-color: light-primary
    font-weight: 700
    .q-icon
      color: $primary




</style>
