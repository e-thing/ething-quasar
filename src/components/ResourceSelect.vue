<template>
  <q-select
   v-model="model"
   :options="options"
   :multiple="multiple"
   v-bind="$attrs"
   emit-value
   @filter="filterFn"
   :display-value="displayValue"
   items-aligned
   options-selected-class="text-deep-orange"
  >
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
    },

    data () {
        return {
          options: this.compute_options(),
          p_model: null
        }
    },

    computed: {

      model: {
        get: function () {
          var mids = this.selectedResources.map(r => r.id())
          return this.multiple ? mids : mids[0]
        },
        set: function (val) {
          var m;
          if (this.multiple) {
            m = this.useId ? val : val.map(id => this.$ething.arbo.get(id))
          } else {
            m = this.useId ? val : this.$ething.arbo.get(val)
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

      displayValue () {
        if (this.selectedResources.length==0) return 'none'
        return this.selectedResources.map(r=>r.basename()).join(', ')
      }
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
        return this.$ething.arbo.find( r => {

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
      },

      compute_options () {
        return this.resources().map( r => {
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
          }
        })
      },

      filterFn (val, update, abort) {
        update(() => {
          this.options = this.compute_options()
        })
      },

    }


}
</script>
