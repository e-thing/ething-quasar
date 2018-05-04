<template>
  <div class="form-schema-optional" :class="{indent: level}">

    <small class="form-schema-description">{{ schema.description }}</small>

    <div>
      <q-toggle v-model="enabled" label="enable"/>
    </div>

    <form-schema ref="sub" v-if="enabled" required :schema="filteredSchema" :model="model" :level="level" @input="setValue" @error="setError"/>

  </div>
</template>

<script>

import { FormComponent } from './core'

export default {
  name: 'FormSchemaOptional',

  mixins: [FormComponent],

  computed: {
    filteredSchema () {

      // remove the type==null schema
      var anyOf = this.schema.anyOf.filter(item => item.type !== 'null')
      if (anyOf.length == 1) {
        return anyOf[0]
      }

      return {
        anyOf
      }
    }
  },

  data () {
    return {
      enabled: false
    }
  },

  watch: {
    model () {
      this.enabled = this.model !== null && typeof this.model !== 'undefined'
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

}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
