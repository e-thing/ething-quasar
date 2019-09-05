<template>
  <div>

    <div v-if="__showHeader" class="row q-py-sm" :class="headerClass" :style="headerStyle">

      <template v-if="__categories">
        <q-btn v-if="!hideAll" flat label="All" :text-color="typeof category_!=='number' ? 'primary' : 'light'" @click="category_ = null" :dense="$q.screen.lt.lg"/>

        <q-btn
          v-for="(cat, index) in __categories"
          :key="index"
          flat
          :text-color="index===category_ ? 'primary' : 'light'"
          @click="category_ = index"
          :icon="cat.icon"
          :label="$q.screen.gt.xs ? cat.label : ''"
          :dense="$q.screen.lt.lg"
        />
      </template>

      <slot name="header-left"></slot>

      <q-space/>

      <slot name="header-right"></slot>

      <q-input v-if="!noSearch" dense outlined v-model="search_" input-class="text-right">
        <template v-slot:append>
          <q-icon v-if="search_ === ''" name="search" />
          <q-icon v-else name="clear" class="cursor-pointer" @click="search_ = ''" />
        </template>
      </q-input>

      <q-btn-dropdown v-if="!noSort" flat text-color="primary" :label="$q.screen.gt.xs ? (typeof sort_ === 'number' ? sortItems[sort_].label : 'sort') : null" icon="mdi-sort" :dense="$q.screen.lt.lg">
        <q-list>
          <q-item
            sort_items
            v-for="(item, index) in sortItems"
            :key="index"
            v-close-popup
            clickable
            @click="sort_ = index"
            :active="sort_ === index" active-class="text-orange"
          >
            <q-item-section>{{ item.label }}</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>

      <template v-if="!readonly && __createSelectOptions.length>0">
        <q-btn v-if="__createSelectOptionsSingle" flat text-color="primary" :label="$q.screen.gt.xs ? 'create' : null" icon="add" @click="create(__createSelectOptions[0].items[0].type)"/>
        <q-btn-dropdown v-else flat text-color="primary" :label="$q.screen.gt.xs ? 'create' : null" icon="add" :dense="$q.screen.lt.lg">
          <q-list>
            <template v-for="cat in __createSelectOptions">
              <q-item-label header>{{ cat.name }}</q-item-label>
              <q-item v-close-popup v-for="item in cat.items" :key="item.type" clickable @click="create(item.type)">
                <q-item-section avatar>
                  <q-icon :name="item.cls.icon" :color="item.cls.color"/>
                </q-item-section>
                <q-item-section>{{ item.label }}</q-item-section>
              </q-item>
            </template>
          </q-list>
        </q-btn-dropdown>
      </template>

    </div>

    <q-list :class="contentClass" :style="contentStyle">
      <template
        v-for="(item, index) in __items"
      >
        <slot name="resource-item" v-bind:item="item">
          <q-separator v-if="index>0 && item.level==0"/>

          <resource-q-item
            :resource="item.resource"
            :level="item.level"
            :no-parent="item.level>0"
            :readonly="readonly"
            :dense="dense"
            @click="itemClick(item)"
          />
        </slot>
      </template>
    </q-list>
  </div>
</template>

<script>
import ResourceQItem from '../components/ResourceQItem'


export default {
    name: 'ResourceList',

    components: {
      ResourceQItem
    },

    props: {
      resources: {},
      /*
      categories: array
      ['resources/Device', {
        label: 'Files',
        filter: 'resources/File'
      }, {
        label: 'Custom',
        icon: 'mdi-file',
        filter: function(resource) {
          return true // or false
        }
      }]
      */
      categories: {},
      category: Number, // index
      hideAll: Boolean,

      createTypes: {},

      tree: Boolean,
      readonly: Boolean,
      dense: Boolean,
      noSort: Boolean,
      noSearch: Boolean,

      createModal: Boolean,

      showHiddenFiles: Boolean,

      headerClass: {},
      headerStyle: {},
      contentClass: {},
      contentStyle: {},

    },

    data () {
        return {
          category_: this.category, // index
          sort_: null, // index
          search_: '',
          sortItems: [{
            label: 'name',
            fn (a, b) {
              return a.name().localeCompare(b.name())
            }
          },{
            label: 'date',
            fn (a, b) {
              return b.modifiedDate() - a.modifiedDate()
            }
          }]
        }
    },

    computed: {

      __showHeader () {
        return this.__categories || this.$slots['header-left'] || this.$slots['header-right'] || !this.noSearch || !this.noSort || (!this.readonly && this.__createSelectOptions.length>0)
      },

      __resources () {
        var resources = [];
        if (typeof this.resources === 'function') {
          resources = this.$ething.arbo.find(this.resources)
        } else if (typeof this.resources === 'string') {
          this.resources.split(' ').forEach(type => {
            if (!type) return
            resources = resources.concat(this.$ething.arbo.find(r => resources.indexOf(r) === -1 && this.$ethingUI.isSubclass(r, type)))
          })
        } else if (Array.isArray(this.resources)) {
          resources = this.resources.map(r => {
            if (typeof r === 'string') return this.$ething.arbo.get(r)
            return r
          })
        } else if (typeof this.resources === 'undefined') {
          resources = this.$ething.arbo.find(r => true)
        }
        return resources
      },

      __createTypes () {
        if (typeof this.createTypes !== 'undefined') {
          if (typeof this.createTypes === 'string') {
            return this.createTypes.split(' ').filter(t => !!t)
          } else {
            return this.createTypes
          }
        } else if (typeof this.resources === 'string') {
          return this.resources.split(' ').filter(type => !!type)
        } else if (typeof this.resources === 'undefined') {
          return ['resources/Resource']
        }
      },

      __createSelectOptions () {
        var clsList = this.$ethingUI.getSubclass(this.__createTypes || []).filter(cls => !cls.virtual && !cls.disableCreation)

        // order by categories
        var categories = {}

        clsList.forEach(cls => {
          var path = (cls.category || 'other').split('.')
          var label = cls.title || cls.split('/').pop()
          var category = path[0]

          if (!categories[category]) {
            categories[category] = {
              items: []
            }
          }

          categories[category].items.push({
            type: cls._type,
            label,
            cls
          })
        })

        var other = categories['other']
        var orderedCategories = []

        delete categories['other']

        for(var category in categories){
          orderedCategories.push(Object.assign({
            name: category
          }, categories[category]))
        }

        if (other) {
          orderedCategories.push(Object.assign({
            name: 'other'
          }, other))
        }

        return orderedCategories
      },

      __createSelectOptionsSingle () {
        return this.__createSelectOptions.length == 1 && this.__createSelectOptions[0].items.length == 1
      },

      __items () {
        var resources = this.__resources;

        if (this.__selectedCategory) {
          resources = resources.filter(this.__selectedCategory.filter)
        }

        if (!this.showHiddenFiles) {
          resources = resources.filter(r => !(r.basename().startsWith('.') && this.$ethingUI.isSubclass(r, 'resources/File')))
        }

        if (this.search_) {
          var re_filter = new RegExp(this.search_, 'i')
          resources = resources.filter(r => {
            return re_filter.test(r.name()) || re_filter.test(r.type()) || re_filter.test(r.description())
          })
        }

        if (typeof this.sort_ === 'number') {
          resources.sort(this.sortItems[this.sort_].fn)
        }

        if (this.tree) {
          return this.makeTree(resources)
        } else {
          return resources.map(r => {
            return {
              resource: r,
              level: 0
            }
          })
        }
      },

      __categories () {
        if (Array.isArray(this.categories)) {
          return this.categories.map(catItem => {
            if (typeof catItem === 'string') {
              // type name
              var cls = this.$ethingUI.get(catItem)
              var label = cls.title
              var icon = cls.icon
              catItem = {
                label,
                icon,
                filter: catItem
              }
            }
            if (typeof catItem.filter === 'string') {
              var type = catItem.filter
              if (!catItem.label) {
                catItem.label = this.$ethingUI.get(type).title
              }
              if (!catItem.label) {
                catItem.icon = this.$ethingUI.get(type).icon
              }
              catItem.filter = (r) => this.$ethingUI.isSubclass(r, type)
            }
            return catItem
          })
        }
      },

      __selectedCategory () {
        if (typeof this.category_ === 'number' && this.__categories) {
          return this.__categories[this.category_]
        }
      }

    },

    watch: {
      category_: {
        handler (value) {
          this.$emit('update:category', value)
        },
        immediate: true
      }
    },

    methods: {

      makeTree (resources) {

        var list = []

        var get = id => {
          for(var i in resources) {
            if(resources[i].id() == id) return resources[i]
          }
        }

        var getChildren = resource => {
      		return resources.filter(r => {
      			return r.createdBy() === resource.id()
      		});
      	}

      	var hasParent = resource => {
          var createdById = resource.createdBy()
      		return createdById && get(createdById);
      	}

      	var level = 0;

        var create = resource => {
          return {
            resource,
            level,
          }
        }

        var order = resource => {
          var list = [create(resource)]

          level++;
      		getChildren(resource).map( r => {
      			list = list.concat(order(r))
      		});
      		level--;

          return list
        }

        resources.filter(r => {
    			return !hasParent(r)
        }).forEach(r => {
          list = list.concat(order(r))
        })

        return list
      },

      itemClick (item) {
        this.$emit('click', item.resource)
      },

      create (type) {

        if (this.createModal) {
          this.$ethingUI.utils.createModal({
            types: [type]
          })
        } else {
          this.$router.push({
            name: 'create',
            params: {
              type
            }
          })
        }
      },

    }


}
</script>
