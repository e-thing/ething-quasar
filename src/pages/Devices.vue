<template>
  <q-page padding>

    <div class="row justify-end">
      <q-btn-dropdown color="primary" label="Create" flat >
        <q-list link>
          <q-item v-close-overlay v-for="type in types" :key="type" @click.native="create(type)">
            <q-item-side :icon="$ething.meta.get(type).icon" :color="$ething.meta.get(type).color" />
            <q-item-main>
              <q-item-tile label>{{ type }}</q-item-tile>
            </q-item-main>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </div>

    <!--<q-tree
      default-expand-all
      :nodes="tree"
      node-key="id"
    >

      <div slot="header-generic" slot-scope="prop" class="row col">
        <q-icon :name="prop.node.icon" :color="prop.node.color" size="24px" class="col-auto q-mr-md" />
        <div class="col column">
          <div>{{ prop.node.label }}</div>
          <small class="text-faded">{{ prop.node.resource.type() }}</small>
          <small class="text-faded">{{ $ui.dateToString(prop.node.resource.modifiedDate()) }}</small>
        </div>
        <div class="col-auto q-ml-md">
          <q-btn icon="delete" round flat dense color="negative" @click.stop="onRemoveClick(prop.node.resource)"/>
          <q-btn icon="settings" round flat dense color="faded" @click.stop="settingsClick(prop.node.resource)"/>
        </div>
      </div>

      <div slot="body-generic" slot-scope="prop">
        <div class="row">
          <q-icon :name="prop.node.icon" :color="prop.node.color" size="24px" class="col-auto q-mr-sm" />
          <div class="col column">
            <div>First column</div>
            <div>Second column</div>
            <div>Third column</div>
          </div>
          <q-icon :name="prop.node.icon" :color="prop.node.color" size="24px" class="col-auto q-mr-sm" />
        </div>
      </div>
    </q-tree>-->

    <div v-if="listOrdered.length">
      <q-list link no-border>

          <q-item v-for="(item, index) in listOrdered" :key="index" :to="$ui.open(item.device)" class="item">
            <div v-for="n in item.level" :class="gen(n)"></div>
            <q-item-side :icon="$ething.meta.get(item.device).icon" inverted :color="$ething.meta.get(item.device).color" />
            <q-item-main>
              <q-item-tile label>{{ item.device.basename() }}</q-item-tile>
              <q-item-tile sublabel>{{ $ui.dateToString(item.device.modifiedDate()) }}</q-item-tile>
              <q-item-tile sublabel>{{ item.device.type() }}</q-item-tile>
            </q-item-main>
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

    var types = this.$ething.meta.types.filter(type => {
      return this.$ething.meta.get(type).inheritances.indexOf('Device') !== -1
    })

    return {
      types
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

    /*tree () {
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
        var node = {
    			label: resource.basename(),
          id: resource.id(),
          icon: self.$ething.meta.get(resource).icon,
          color: self.$ething.meta.get(resource).color,
    			resource: resource,
    			children: [],
    			level: level,
          header: 'generic',
          // body: 'generic',
    		};

        level++;
    		node.children = getChildren(resource).map(function(r){
    			return create(r);
    		});
    		level--;

        return node
      }

  		var rootNodes = this.$store.getters['ething/filter'](function(r){
  			return (r instanceof EThing.Device)
  		}).filter(function(r){
  			return !hasParent(r)
      }).map(function(r){
        return create(r)
      })

    	return rootNodes;
    }*/

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

      this.$q.dialog({
        title: 'Remove',
        message: 'Do you really want to remove definitely the ' + resource.type() + ' "' + resource.name() + '" ?',
        options: {
          type: 'checkbox',
          model: [],
          items: [
            {label: 'Remove also the children resources', value: 'removeChildren', color: 'secondary'},
          ]
        },
        ok: 'Remove',
        cancel: 'Cancel'
      }).then((data) => {
        resource.remove(data.indexOf('removeChildren') !== -1).done( () => {
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
