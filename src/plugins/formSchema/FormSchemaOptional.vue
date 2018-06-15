<template>
  <div class="form-schema-optional" :class="{indent: level}">

    <small v-if="schema.description" class="form-schema-description">{{ schema.description }}</small>

    <div>
      <q-toggle v-model="enabled" label="enable"/>
    </div>

    <form-schema ref="sub" v-if="enabled" required :schema="filteredSchema" :model="cachedValue" :level="level" @input="onChildValueChange" @error="setError"/>

  </div>
</template>

<script>

import { FormComponent } from './core'
import { extend } from 'quasar'

export default {
  name: 'FormSchemaOptional',

  mixins: [FormComponent],

  computed: {
    filteredSchema () {

      var copySchema = Object.assign({}, this.schema)
      delete copySchema.anyOf
      delete copySchema.description

      // remove the type==null schema
      var anyOf = this.schema.anyOf.filter(item => item.type !== 'null')
      if (anyOf.length == 1) {
        copySchema = extend(true, copySchema, anyOf[0])
      } else {
        copySchema.anyOf = anyOf
      }
      
      return copySchema
    }
  },

  data () {
    return {
      enabled: false,
      cachedValue: undefined
    }
  },

  watch: {
    model () {
      this.refreshFromModel()
    },

    enabled (val) {
      this.$nextTick(() => {
        if (val) {
          this.setValue(this.$refs['sub'].value)
          this.setError(this.$refs['sub'].error)
        } else {
          this.setValue(null)
          this.setError(false)
        }
      })
    }
  },

  methods: {
    refreshFromModel () {
      this.enabled = this.model !== null && typeof this.model !== 'undefined'
      if (this.enabled) {
        this.cachedValue = this.model
      }
    },

    onChildValueChange (val) {
      this.cachedValue = val
      this.setValue(val)
    }
  },

  mounted () {
    this.refreshFromModel()
  },

}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
