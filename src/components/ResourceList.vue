<template>
  <div class="column">

    <div v-if="__showHeader" class="col-auto row q-py-sm" :class="headerClass" :style="headerStyle">

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

      <q-input v-if="__showSearch" dense outlined v-model="search_" input-class="text-right" debounce="500">
        <template v-slot:append>
          <q-icon v-if="search_ === ''" name="search" />
          <q-icon v-else name="clear" class="cursor-pointer" @click="search_ = ''" />
        </template>
      </q-input>

      <q-btn-dropdown v-if="sort" flat text-color="primary" :label="$q.screen.gt.xs ? (__selectedSortItem ? __selectedSortItem.label : 'sort') : null" icon="mdi-sort" :dense="$q.screen.lt.lg">
        <q-list>
          <q-item
            sort_items
            v-for="(item, index) in __sortItems"
            :key="index"
            v-close-popup
            clickable
            @click="sort_ = item.name"
            :active="item === __selectedSortItem" active-class="text-orange"
          >
            <q-item-section>{{ item.label }}</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>

      <template v-if="!readonly && __createTypes.length>0">
        <q-btn flat text-color="primary" :label="$q.screen.gt.xs ? 'create' : null" icon="add" @click="showCreatePopup_=true"/>
        <resource-create-modal :types="__createTypes" v-model="showCreatePopup_" open/>
      </template>

    </div>

    <template v-if="__filteredResources.length>0">
      <q-list class="col scroll" :class="contentClass" :style="contentStyle">

        <template v-if="__groups.length==0">
          <template
            v-for="(item, index) in __toItems(__filteredResources)"
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
                :class="itemClass"
                :style="itemStyle"
              />
            </slot>
          </template>
        </template>
        <template v-else>
          <!-- grouped -->
          <template
            v-for="(group, pIndex) in __groups"
          >
            <q-separator v-if="pIndex>0" />

            <q-expansion-item
              v-if="group.resources.length>0"
              :icon="group.icon"
              :label="group.label + ' (' + group.resources.length + ')'"
              default-opened
              header-class="text-faded"
              :header-inset-level="group.icon ? 0 : 1"
            >
              <template
                v-for="(item, index) in __toItems(group.resources)"
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
                    :class="itemClass"
                    :style="itemStyle"
                  />
                </slot>
              </template>
            </q-expansion-item>
          </template>
        </template>
      </q-list>
    </template>
    <div v-else class="col relative-position" style="min-height: 50px;">
      <div class="absolute-center text-caption text-faded">
        {{ __emptyMessage }}
      </div>
    </div>
  </div>
</template>

<script>
import ResourceListBase from './ResourceListBase'


export default {
    name: 'ResourceList',

    mixins: [ResourceListBase],

    props: {
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
      defaultCategory: Number, // index
      hideAll: Boolean,

      readonly: Boolean,
      dense: Boolean,
      sort: Boolean,
      search: Boolean,

      emptyMessage: {
        type: String,
        default: '<default>'
      },

      headerClass: {},
      headerStyle: {},
      contentClass: {},
      contentStyle: {},
      itemClass: {},
      itemStyle: {},
    },

    data () {
        return {
          category_: this.defaultCategory, // index
          showCreatePopup_: false
        }
    },

    computed: {

      __showHeader () {
        return this.__categories || this.$slots['header-left'] || this.$slots['header-right'] || this.__showSearch || this.sort || (!this.readonly && this.__createTypes)
      },

      __showSearch () {
        return this.search && this.$q.screen.gt.sm
      },

      __checksum () {
        return this.__filteredResources.map(r => r.id()).join(' ')
      },

      __categories () {
        if (Array.isArray(this.categories)) {
          return this.__formatGroupList(this.categories)
        }
      },

      __typename () {
        var name = "resource"
        if (typeof this.resources === 'string') {
          var types = this.resources.split(' ')
          if (types.length == 1) {
            name = this.$ethingUI.get(types[0]).title
          }
        }
        return name
      },

      __emptyMessage () {
        var msg = this.emptyMessage
        if (msg==='<default>') {
          msg = "No " + this.__typename + " found"
        }
        return msg
      }

    },

    watch: {
      category_: {
        handler (index) {
          if (typeof index === 'number' && this.__categories) {
            this.filter_ = this.__categories[index].filter
          } else {
            this.filter_ = null
          }
          this.$emit('update:category', index)
        },
        immediate: true
      },
      __checksum: {
        handler (value, oldValue) {
          this.$emit('changed', this.__filteredResources.slice(0))
        },
        immediate: true
      }
    },

    methods: {

      itemClick (item) {
        this.$emit('click', item.resource)
      },

    }


}
</script>
