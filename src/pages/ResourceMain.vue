<template>
  <q-page class="center-width-md q-gutter-y-md q-py-md q-px-sm">

      <q-list dense style="margin-left: -16px;margin-right: -16px;">
        <q-item>
          <q-item-section avatar top>
            <q-avatar :icon="meta.icon" text-color="white" :color="meta.color" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-h4 ellipsis" :class="'text-' + meta.color">
              {{ resource.basename() }}
              <q-icon v-if="resource.hasAttr('connected') && !resource.attr('connected')" right name="mdi-lan-disconnect" color="warning" />

              <q-avatar v-for="(icon, key) in extendsIcons" :key="key" :icon="icon" :color="meta.color" text-color="white" size="24px" class="gt-xs q-mr-xs" />

            </q-item-label>
            <q-item-label caption>{{ meta.title }}</q-item-label>
          </q-item-section>
          <q-item-section side top>
            <q-btn
              flat
              :label="$q.screen.lt.md ? '' : 'settings'"
              color="faded"
              icon="settings"
              @click="openSettings()"
            />
          </q-item-section>
        </q-item>
        <q-item :inset-level="1" v-if="createdBys.length">
          <q-item-section>
            <div>
              <template v-for="(item, index) in createdBys">
                <q-icon name="mdi-chevron-right" />
                <span class="createdby-item" @click="$ethingUI.open(item)">{{ item.basename() }}</span>
              </template>
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <div>
      <q-chip dense square icon="access_time" outline color="secondary" v-if="resource.attr('lastSeenDate')" class="q-ml-none">
        {{ $ethingUI.utils.dateToString(resource.lastSeenDate(), 'never') }}
      </q-chip>
      <dynamic-component
        :component="badge"
        v-for="(badge, index) in badges" :key="index"
        class="q-ml-none"
      />
    </div>

    <!-- error -->
    <div v-if="resource.attr('error')">
      <q-banner class="bg-negative text-white"><q-icon left name="mdi-alert"/> {{ resource.attr('error') }}</q-banner>
    </div>

    <!-- disconnected -->
    <div v-if="resource.hasAttr('connected') && !resource.attr('connected')">
      <q-banner class="bg-warning text-white"><q-icon left name="mdi-lan-disconnect"/> This device is disconnected !</q-banner>
    </div>

    <!-- description -->
    <div class="text-faded" v-if="resource.description()">
      {{ resource.description() }}
    </div>

    <!-- components -->
    <div v-for="(item, index) in componentsItems" :key="index" v-if="componentsItems.length>0">
      <div class="text-h6 text-grey-8 q-py-md" v-if="item.title">
        <q-icon :name="item.icon || 'mdi-brightness-1'" left/>
        <span>{{ item.title }}</span>
      </div>
      <div class="bg-white">
        <dynamic-component :component="item"/>
      </div>
    </div>

    <!-- activity -->
    <div>
      <div class="text-h6 text-grey-8 q-py-md">
        <q-icon name="mdi-bell" left/>
        <span>Activity</span>
      </div>
      <div class="bg-white" style="max-height: 400px;overflow: auto;">
        <resource-activity :source="activitySource" />
      </div>
    </div>

    <!-- attributes -->
    <div class="attributes">
      <div class="text-h6 text-grey-8 q-py-md">
        <q-icon name="mdi-format-list-bulleted" left/>
        <span>Attributes</span>
        <q-btn class="float-right" flat rounded size="small" :label="showDetailledAttributes ? 'less' : 'more'" :icon="showDetailledAttributes ? 'expand_less' : 'expand_more'" style="line-height: initial" @click="showDetailledAttributes = !showDetailledAttributes"/>
      </div>
      <div class="bg-white q-pa-md">
        <div class="row" v-if="attributes.length>0">
          <template v-for="attr in attributes">
            <div class="col-xs-12 col-sm-2 key text-secondary ellipsis">{{ attr.name }}</div>
            <div class="col-xs-12 col-sm-10 value text-faded ellipsis">{{ attr.value }}</div>
          </template>
        </div>
        <div v-else class="text-center text-faded">
          <small>no attributes</small>
        </div>
      </div>
    </div>

    <!-- resource -->
    <div v-if="children.length">
      <div class="text-h6 text-grey-8 q-py-md">
        <q-icon name="mdi-database" left/>
        <span>Resources</span>
      </div>
      <div class="bg-white">
        <q-list>
          <resource-q-item v-for="child in children" :key="child.id()" :resource="child" />
        </q-list>
      </div>
    </div>

    <!-- api -->
    <div v-if="Object.keys(staticMeta.methods).length">
      <div class="text-h6 text-grey-8 q-py-md">
        <q-icon name="mdi-console" left/>
        <span>Commands</span>
      </div>
      <div class="bg-white">
        <device-api :device="resource" />
      </div>
    </div>

  </q-page>
</template>

<script>

export default {
  name: 'PageResourceMain',

  data () {

    return {
      showDetailledAttributes: false,
      componentsItems: [],
      _resourceId: null,
      isSensor: false,
      staticMeta: {},
      extendsIcons: []
    }
  },

  watch: {
    resource : {
      handler (resource) {
        if (resource && this._resourceId != resource.id()) {
          this.load()
        }
      },
      immediate: true
    }
  },

  methods: {
    load () {
      this._resourceId = this.resource.id()

      this.isSensor = this.$ethingUI.isSubclass(this.resource, 'interfaces/Sensor')

      var staticMeta = this.staticMeta = this.$ethingUI.get(this.resource)
      var componentsItemsList = Object.values(staticMeta.components).filter(w => !w.disable)

      // re order by zIndex
      componentsItemsList.sort(function(a, b) {
          return b.zIndex - a.zIndex;
      });

      this.componentsItems = componentsItemsList

      // extends
      var currentType = this.resource.type()
      var extendsIcons = this.extendsIcons = []
      var types = this.resource.types()
      for (var i in types) {
        var t = types[i]
        if (t==currentType || t=='interfaces/Sensor') continue
        if (t=='resources/Resource') break
        var m = this.$ethingUI.getRaw(t)
        if (m && m.icon && extendsIcons.indexOf(m.icon) === -1 && m.icon != staticMeta.icon) {
          extendsIcons.push(m.icon)
        }
      }
    },

    deepChildren (items, resource, filter) {
      this.$ething.arbo.find(r => {
        if (r.createdBy() === resource.id()) {
          if (!filter || filter(r)) {
            if (items.indexOf(r) === -1) {
              items.push(r)
              // the children too
              this.deepChildren(items, r, filter)
            }
          }
        }
      })
    },
    openSettings () {
      this.$router.push({
        name: 'resourceEdit',
        params: {
          id: this.resource.id()
        }
      })
    },
  },

  computed: {
    resource () {
      var id = this.$route.params.id
      var r = this.$ething.arbo.get(id)
      if (id && id.length) {
        if (!r) {
          this.$router.replace('/404')
        }
      }
      return r
    },

    meta () {
      return this.$ethingUI.get(this.resource)
    },

    badges () {
      var badges = Object.values(this.meta.badges)
      // re order by zIndex
      badges.sort(function(a, b) {
          return b.zIndex - a.zIndex;
      });
      return badges
    },

    children () {
      return this.$ething.arbo.find(r => {
        return r.createdBy() === this.resource.id()
      })
    },

    activitySource () {
      var items = [this.resource]
      this.deepChildren(items, this.resource, r => r instanceof this.$ething.Device)
      return items
    },

    data () {
      var data = this.resource.data()
      return data && Object.keys(data).length > 0 ? data : undefined
    },

    attributes () {
      var props = this.meta.properties
      var attributes = []
      var skippedFields = ['name', 'description']
      var detailledFields = ['id', 'modifiedDate', 'createdBy', 'type', 'extends', 'data', 'createdDate', 'methods', 'battery', 'location', 'interfaces', 'connected', 'lastSeenDate', 'error']
      for(let name in props) {
        if (skippedFields.indexOf(name) !== -1) continue

        let prop = props[name]
        let value = prop.getFormatted(this.resource)

        if (!this.showDetailledAttributes && detailledFields.indexOf(name) !== -1) continue

        if (value === null || typeof value === 'undefined') value = '-'

        attributes.push({
          name,
          value
        })
      }
      return attributes
    },

    createdBys () {
      var createdBys = []
      var p = this.resource.createdBy()

      while (p) {
        var pr = this.$ething.arbo.get(p)
        if (!pr) break
        createdBys.push(pr)
        p = pr.createdBy()
      }

      return createdBys.reverse()
    },
  },

}
</script>

<style lang="stylus">


.attributes
  .key.detailled, .value.detailled
    display none
  &.detailled
    .key.detailled, .value.detailled
      display block

.createdby-item
  color $faded
  cursor pointer
  &:hover
    color $primary



</style>
