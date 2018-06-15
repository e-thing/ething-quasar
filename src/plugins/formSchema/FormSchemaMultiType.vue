<template>
  <div class="form-schema-multi-type">

    <small v-if="schema.description" class="form-schema-description">{{ schema.description }}</small>


    <q-select
      stack-label="type"
      :value="type" @input="setType"
      :options="selectOptions"
    />

    <form-schema v-if="isValid" ref="child" :required="required" :schema="computedSchema" :model="cachedValue" :level="level" @input="onChildValueChange" @error="setError"/>

  </div>
</template>

<script>

import { FormComponent } from './core'

const defaultTypes = ['string', 'number', 'boolean', 'object', 'array']


export default {
  name: 'FormSchemaMultiType',

  mixins: [FormComponent],

  props: {
    types: {
      type: Array,
      default () {
        return defaultTypes
      }
    }
  },

  computed: {

    isValid () {
      return typeof this.computedSchema === 'object'
    },

    computedSchema () {
      return typeof this.type !== 'undefined' ? { type: this.type } : undefined
    },

    selectOptions () {
      return this.types.map(type => {
        return {
          label: type,
          value: type
        }
      })
    },
  },

  data () {
    return {
      type: undefined,
      cachedValue: undefined
    }
  },

  watch: {
    model () {
      this.refreshFromModel()
    },
  },

  methods: {

    setType (type) {
      this.type = type

      this.$nextTick(() => {
        if (this.$refs['child']) {
          this.setValue(this.$refs['child'].value)
          this.setError(this.$refs['child'].error)
        }
      })

    },

    refreshFromModel () {
      var jsType = typeof this.model

      if (jsType === 'object' && Array.isArray(this.model)) {
        jsType = 'array'
      }

      if (this.types.indexOf(jsType) !== -1) {
        this.type = jsType
        this.cachedValue = this.model
      } else {
        this.type = this.types[0]
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
