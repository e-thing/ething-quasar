<template>
  <q-page padding>

    <div class="row justify-end">
      <q-btn-dropdown color="primary" label="Create" icon="add" flat >
        <q-list link>
          <template v-for="cat in categories">
            <q-list-header inset>{{ cat.name }}</q-list-header>
            <q-item v-close-overlay v-for="type in cat.types" :key="type.type" @click.native="create(type.type)">
              <q-item-side :icon="$ething.meta.get(type.type).icon" :color="$ething.meta.get(type.type).color" />
              <q-item-main>
                <q-item-tile label>{{ type.label }}</q-item-tile>
              </q-item-main>
            </q-item>
          </template>
        </q-list>
      </q-btn-dropdown>
    </div>

    <div v-if="listOrdered.length">
      <q-list link no-border>

          <q-item v-for="(item, index) in listOrdered" :key="index" :to="$ui.open(item.device)" class="item">
            <div v-for="n in item.level" :class="gen(n)"></div>
            <q-item-side :icon="$ething.meta.get(item.device).icon" inverted :color="$ething.meta.get(item.device).color" />
            <q-item-main>
              <q-item-tile label>{{ item.device.basename() }}</q-item-tile>
              <q-item-tile sublabel>{{ $ui.dateToString(item.device.lastSeenDate() || item.device.modifiedDate()) }}</q-item-tile>
              <q-item-tile sublabel>{{ item.device.type() }}</q-item-tile>
            </q-item-main>
            <q-item-side right v-if="item.device.hasBattery()">
              <q-chip small detail icon="battery std" color="primary">
                {{ item.device.battery() }}%
              </q-chip>
            </q-item-side>
            <q-item-side right>
              <q-btn icon="delete" round flat dense color="negative" @click.stop="onRemoveClick(item.device)"/>
            </q-item-side>
            <q-item-side right>
              <q-btn icon="settings" round flat dense @click.stop="settingsClick(item.device)"/>
            </q-item-side>
          </q-item>

      </q-list>
    </div>

    <div v-else class="q-pa-md">
    No devices installed.
    </div>

  </q-page>
</template>

<script>
import EThing from 'ething-js'

export default {
  name: 'PageDevices',

  data () {

    var categories = {}

    this.$ething.meta.types.forEach(type => {
      var meta = this.$ething.meta.get(type)
      if (meta.inheritances.indexOf('Device') !== -1 && !meta.virtual) {

        var path = meta.path || []
        var label = meta.label || type
        var category = path.length>0 ? path[0] : 'other'

        if (!categories[category]) {
          categories[category] = {
            types: []
          }
        }

        categories[category].types.push({
          label,
          type
        })
      }
    })

    var other = categories['other']
    var orderedCategories = []

    delete categories['other']

    for(var category in categories){
      orderedCategories.push(Object.assign({
        name: category
      }, categories[category]))
    }

    orderedCategories.push(Object.assign({
      name: 'other'
    }, other))

    return {
      categories: orderedCategories
    }
  },

  computed: {
    devices () {
      return this.$store.getters['ething/filter'](r => {
        return r instanceof this.$ething.Device
      })
    },

    listOrdered () {

      var list = []
      var self = this

      function getChildren(resource){
    		return self.$store.getters['ething/filter'](function(r){
    			return r.createdBy() === resource.id() && (r instanceof EThing.Device)
    		});
    	}

    	function hasParent(resource){
    		return !!resource.createdBy();
    	}

    	var level = 0;

      function create(resource) {
        return {
          device: resource,
          level,
          indent: level * 20
        }
      }

      function order(resource) {
        var list = [create(resource)]

        level++;
    		getChildren(resource).map(function(r){
    			list = list.concat(order(r))
    		});
    		level--;

        return list
      }

      this.$store.getters['ething/filter'](function(r){
  			return (r instanceof EThing.Device)
  		}).filter(function(r){
  			return !hasParent(r)
      }).forEach(function(r){
        list = list.concat(order(r))
      })

      return list
    },

  },

  methods: {

    gen (n) {
      return ['pad', 'pad-'+n]
    },

    settingsClick (resource) {
      this.$router.push('/resource/' + resource.id())
    },

    onRemoveClick (resource) {
      var name = resource.name()

      var children = this.$ething.arbo.find(r => {
        return r.createdBy() === resource.id()
      })

      var items = []

      if (children.length) {
        items.push({label: 'Remove also the children resources', value: 'removeChildren', color: 'secondary'})
      }

      this.$q.dialog({
        title: 'Remove',
        message: 'Do you really want to remove definitely the ' + resource.type() + ' "' + resource.name() + '" ?',
        options: {
          type: 'checkbox',
          model: [],
          items
        },
        ok: 'Remove',
        cancel: 'Cancel'
      }).then((data) => {
        resource.remove(data.indexOf('removeChildren') !== -1).then( () => {
          this.$q.notify(name + ' removed !')
        })
      })
    },

    create (type) {
      this.$router.push('/create/'+type)
    }

  }
}
</script>


<style lang="stylus" scoped>
@import '~variables'

pad-width = 40px
pad-start = 34px

.pad:before
    content ''
    position absolute
    right auto

.pad:before
    border-left 2px solid $purple-2
    bottom 0px
    top -0px
    width 1px

.pad
  width pad-width

.pad-1:before
  left pad-start

.pad-2:before
  left pad-start + 1 * pad-width

.pad-3:before
  left pad-start + 2 * pad-width

.pad-4:before
  left pad-start + 3 * pad-width

</style>
