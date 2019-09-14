<template>
  <q-select
   v-model="model"
   :options="options"
   :multiple="multiple"
   v-bind="$attrs"
   :use-input="enableFilter"
   @filter="filterFn"
   :input-debounce="filtering ? 300 : 0"
   items-aligned
   options-selected-class="text-deep-orange"
   :virtual-scroll-slice-size="200"
   :placeholder="selectedResources.length ? 'search for a resource...' : 'Select a resource'"
   stack-label
  >
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey">
          No resources
        </q-item-section>
      </q-item>
    </template>

    <template v-slot:selected-item="scope" v-if="selectedResources.length">
      <q-chip
        removable
        dense
        @remove="scope.removeAtIndex(scope.index)"
        :tabindex="scope.tabindex"
        :color="scope.opt.color"
        text-color="white"
        class="q-ml-none q-my-xs q-mr-xs"
        :icon="scope.opt.icon"
        :label="scope.opt.label"
      />
    </template>

    <template v-slot:option="scope">
      <q-item
        v-bind="scope.itemProps"
        v-on="scope.itemEvents"
      >
        <q-item-section avatar>
          <q-avatar :color="scope.opt.color" text-color="white" :icon="scope.opt.icon" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ scope.opt.label }}</q-item-label>
          <q-item-label caption>{{ scope.opt.title }}</q-item-label>
          <q-item-label v-if="!!scope.opt.createBys" caption>
            <template v-for="createBy in scope.opt.createBys">
              <q-icon name="keyboard_arrow_right"/>
              <span>{{ createBy.basename() }}</span>
            </template>
          </q-item-label>
        </q-item-section>
      </q-item>
    </template>

    <template v-slot:append v-if="!disableCreate && computedCreateTypes.length!=0">
      <q-icon name="add" class="cursor-pointer" @click="openCreateModal" />
    </template>
  </q-select>
</template>

<script>
import EThing from 'ething-js'
import {createModal} from '../utils'


const sortMap = {
  name (a, b) {
    return a.name().localeCompare(b.name())
  },
  date (a, b) {
    return b.modifiedDate() - a.modifiedDate()
  }
}

export default {
    name: 'ResourceSelect',

    props: {
      type: String,
      notType: String,
      filter: {},
      value: {},
      useId: Boolean,
      multiple: Boolean,
      disableCreate: Boolean,
      createTypes: Array,
      showHiddenFiles: Boolean,
      sort: {},
      enableFilter: Boolean
    },

    data () {
        return {
          options: this.compute_options(),
          p_model: null,
          filtering: false
        }
    },

    computed: {

      model: {
        get: function () {
          var mids = this.selectedResources.map(r => {
            for (var i in this.options) {
              if (this.options[i].value === r.id()) {
                return this.options[i]
              }
            }
          })
          return this.multiple ? mids : mids[0]
        },
        set: function (val) {
          var m;
          if (!val) {
            m = this.multiple ? [] : null
          } else {
            if (this.multiple) {
              m = this.useId ? val.map(opt => opt.value) : val.map(opt => opt.resource)
            } else {
              m = this.useId ? val.value : val.resource
            }
          }
          this.$emit('input', m)
        }
      },

      computedCreateTypes () {
        if (this.createTypes) {
          return this.createTypes
        } else if (this.type) {
          return this.type.split(/[ ;,]+/)
        } else {
          return ['resources/Resource']
        }
      },

      selectedResources () {
        if (this.multiple) {
          var v = []
          if (Array.isArray(this.value)) {
            v = this.value
          } else if (this.value) {
            v = [this.value]
          }

          return this.useId ? v.map(id => {
            return this.$ething.arbo.get(id)
          }) : v
        } else if (this.value) {
          return [this.useId ? this.$ething.arbo.get(this.value) : this.value]
        } else {
          return []
        }
      },
    },

    methods: {
      openCreateModal () {
        createModal({
          types: this.computedCreateTypes
        })
      },

      resources () {

        var notTypes = null
        var types = null

        if (this.notType) {
          notTypes = this.notType.split(/[ ;,]+/)
        }
        if (this.type) {
          types = this.type.split(/[ ;,]+/)
        }
        var resources = this.$ething.arbo.find( r => {

          if (!this.showHiddenFiles) {
            if (r.basename().startsWith('.')) {
              return false
            }
          }

          if (notTypes) {
            for(var i in notTypes) {
              if (r.isTypeof(notTypes[i])) {
                return false
              }
            }
          }

          if (types) {
            var pok = false
            for(var i in types) {
              if (r.isTypeof(types[i])){
                pok = true
                break
              }
            }
            if (!pok) return false
          }

          if (this.filter) {
            return !!this.filter(r)
          }

          return true
        })

        var sortFn = null
        if (typeof this.sort === 'string') {
          sortFn = sortMap[this.sort]
        } else {
          sortFn = this.sort
        }

        if (sortFn) {
          resources.sort(sortFn)
        }

        return resources
      },

      compute_options (filterValue) {
        var resources = this.resources()

        if (filterValue) {
          var re_filter = new RegExp(filterValue, 'i')
          resources = resources.filter(r => {
            return re_filter.test(r.name()) || re_filter.test(r.type()) || re_filter.test(r.description()) || re_filter.test(r.attr('location'))
          })
        }

        return resources.map( r => {

          var createdByArr = []
          var p = r
          for (let i = 0; i<2; i++) {
            var createdBy = p.createdBy() ? this.$ething.arbo.get(p.createdBy()) : null
            if (createdBy) {
              createdByArr.push(createdBy)
              p = createdBy
            } else {
              break
            }
          }

          var meta = this.$ethingUI.get(r)

          return {
            label: r.name(),
            value: r.id(),
            icon: meta.icon,
            color: meta.color,
            title: meta.title,
            createBys: createdByArr,
            resource: r
          }
        })
      },

      filterFn (val, update, abort) {
        this.filtering = !!val
        update(() => {
          this.options = this.compute_options(val)
        })
      },

      /*filterFn (val, update) {
        if (val === '') {
          update(() => {
            this.options = stringOptions
          })
          return
        }

        update(() => {
          const needle = val.toLowerCase()
          this.options = stringOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
        })
      }*/

    }


}
</script>
