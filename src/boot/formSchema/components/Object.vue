<template>
  <form-schema-layout class="form-schema-object" :class="{indent: level}">

    <template v-if="items.length > 1">
      <q-tabs
        v-model="group_"
        dense
        class="text-grey"
        align="justify"
      >
        <q-tab
          v-for="g in items"
          :key="g.name"
          :name="g.name"
          :label="g.name"
          :class="{'text-negative': hasGroupError(g), 'text-primary': g.name === group_}"
        />
      </q-tabs>

      <q-separator class="q-mb-md"/>
    </template>

    <q-tab-panels v-model="group_" keep-alive>

      <q-tab-panel
        v-for="g in items"
        :key="g.name"
        :name="g.name"
        class="q-pa-none"
      >
        <template v-if="g.items.length>0">
          <div
            v-for="item in g.items"
            :key="item.key"
            class="form-schema-object-item"
            :class="{'form-schema-object-item-required': item.required, 'form-schema-object-item-error': !!errors[item.key]}"
            :style="{display: inlined ? 'inline' : 'block'}"
          >
            <div
              class="form-schema-object-item-title text-subtitle2"
              :style="{display: inlined ? 'inline' : 'block'}"
              v-if="!item.schema.$hideLabel"
            >
              {{ item.schema.title || item.key }}
              <!--<small v-if="!inlined && !item.required">(optional)</small>-->

              <q-toggle class="q-ml-sm" :value="item.enable" v-if="item.schema.$optional" @input="onEnableChange(item, $event)"/>
            </div>
            <form-schema v-if="item.enable" :required="item.required" :inline="inlined" :force-description="!inlined" :schema="item.schema" :value="item.model" :level="level+1" @input="onChildValueChange(item, $event)" @error="onChildErrorChange(item, $event)"/>
          </div>
        </template>

        <div v-else>
            <small class="text-faded">empty</small>
        </div>
      </q-tab-panel>
    </q-tab-panels>

  </form-schema-layout>
</template>

<script>

import { FormComponent } from '../core'


/*
options
$order: string[] // order the properties according to the given list
properties.$hideLabel: boolean // if true, no label will be displayed for this properties
properties.$readOnly: boolean // if true, this property will be skipped
properties.$disabled: boolean // if true, this property will be skipped
properties.$required: boolean // if true, this property will be considered as required
*/


function isObject(obj) {
  return typeof obj === 'object' && obj!==null
}

export default {
  name: 'FormSchemaObject',

  mixins: [FormComponent],

  data () {
    return {
      errors: {},
      cache: {},
      group_: null,
    }
  },

  computed: {
    items () {
      var schema = this.c_schema
      var requiredProperties = schema.required || []
      var readOnlyProperties = []
      var disabledProperties = []

      for(let k in schema.properties) {
        if (!schema.properties[k] || schema.properties[k]['$disabled']) {
          disabledProperties.push(k)
        } else {
          if (!schema.properties[k]['$readOnly']) {
              // todo: warning, required does not work for object since this attribute is already used as array
              if (schema.properties[k]['$required'] && requiredProperties.indexOf(k)===-1 && !schema.properties[k]['$optional']) {
                  requiredProperties.push(k)
              }
          } else {
            readOnlyProperties.push(k)
          }
        }
      }

      var keyOrdered = requiredProperties.concat(Object.keys(schema.properties || {}).filter(k => {
          return requiredProperties.indexOf(k)===-1 && readOnlyProperties.indexOf(k)===-1
      })).filter(k => disabledProperties.indexOf(k)===-1 && !!schema.properties[k])

      var groups = []
      keyOrdered.forEach(key => {
        var group = schema.properties[key]['$group']
        if (groups.indexOf(group) === -1) groups.push(group)
      })

      if (schema['$order']) {
        for (var i = schema['$order'].length; i>0; i--) {
          var key = schema['$order'][i - 1]
          var index = keyOrdered.indexOf(key)
          if (index !== -1) {
            keyOrdered.splice(index, 1)
            keyOrdered.unshift(key)
          }
        }
      }

      // clean errors map
      var errorsDirty = false
      Object.keys(this.errors).forEach(key => {
        if (keyOrdered.indexOf(key) === -1) {
          delete this.errors[key]
          errorsDirty = true
        }
      })
      if (errorsDirty) {
        this.$emit('error', Object.values(this.errors).some(err => err))
      }

      // clean value
      var copy_value = Object.assign({}, this.c_value)
      var valueDirty = false
      Object.keys(copy_value).forEach(key => {
        if (keyOrdered.indexOf(key) === -1) {
          delete copy_value[key]
          valueDirty = true
        }
      })
      if (valueDirty) {
        this.c_value = copy_value
      }

      var items = keyOrdered.map(key => {
        var schema_ = schema.properties[key]
        var value = (this.c_value || {})[key]
        var group = schema_['$group']

        var enable = true

        if (schema_.$optional) {
          enable = this.c_value && (key in this.c_value)
        }

        return {
          key,
          schema: schema_,
          required:  requiredProperties.indexOf(key) !== -1,
          model: value,
          enable,
          group
        }
      })

      return groups.map(group => {
        var groupName = group || 'general';
        return {
          name: groupName,
          items: items.filter(i => i.group === group)
        }
      })
    }
  },

  watch : {
    items: {
      handler (val) {
        var groups = val.map(g => g.name)
        if (this.group_ === null || groups.indexOf(this.group_) === -1) {
          this.group_ = groups[0]
        }
      },
      immediate: true
    }
  },

  methods: {
    onChildValueChange (item, val) {
      if (isObject(this.c_value)) {
        this.$set(this.c_value, item.key, val)
      } else {
        var o = {}
        o[item.key] = val
        this.c_value = o
      }
    },

    onChildErrorChange (item, val) {
      this.$set(this.errors, item.key, val)
      this.$emit('error', Object.values(this.errors).some(err => err))
    },

    onEnableChange (item, val) {
      if (val) {
        this.$set(this.c_value, item.key, this.cache[item.key])
        delete this.cache[item.key]
      } else {
        this.cache[item.key] = this.c_value[item.key]
        this.$delete(this.c_value, item.key)
      }
    },

    hasGroupError (group) {
      return group.items.some(item => {
        return this.errors[item.key]
      })
    }
  },

  rule (schema) {
    return schema.type === 'object' || typeof schema.properties === 'object'
  }

}

</script>

<style lang="stylus" scoped>


verticalMargin = $space-y-base
pad-width = $space-base

.indent
  margin-left: pad-width

.form-schema-object-item
  &:not(:last-child)
    margin-bottom verticalMargin

  &.form-schema-object-item-required
    & > .form-schema-object-item-title:after
          content '*'
          color $negative
          margin-left 8px

  &.form-schema-object-item-error
    & > .form-schema-object-item-title
      color $negative


</style>
