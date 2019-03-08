<template>
  <div class="form-schema-layout" :style="{display: inlined ? 'inline' : 'block'}">
    <small
      style="display: block;"
      v-if="(forceDescription || !inlined) && schema.description"
      class="form-schema-description"
    >
      <vue-markdown class="markdown" :anchorAttributes="{target: '_blank'}">{{ schema.description.trim() }}</vue-markdown>
    </small>
    <slot></slot>
    <small
      style="display: block;"
      class="form-schema-error"
      v-if="!inlined && error"
    >
      {{ error }}
    </small>
  </div>
</template>

<script>

import VueMarkdown from 'vue-markdown'

export default {
  name: 'formSchemaLayout',
  
  components: {
    VueMarkdown
  },
  
  props: {
    'forceDescription': Boolean
  },

  computed: {
    inlined () {
      return this.$parent.inlined
    },

    schema () {
      return this.$parent.c_schema
    },

    error () {
      return this.$parent.error
    },

    level () {
      return this.$parent.level
    },

  },

}

</script>

<style lang="stylus" scoped>
@import '~variables'

.form-schema-description
    margin-bottom 8px
    display inline-block
    color $faded

.form-schema-error
  color $negative

</style>
