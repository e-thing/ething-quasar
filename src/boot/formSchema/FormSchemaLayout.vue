<template>
  <div class="form-schema-layout" :style="{display: inlined ? 'inline' : 'block'}">
    <span
      style="display: block;"
      v-if="(forceDescription || !inlined || forceDescriptionParent) && schema.description"
      class="form-schema-description text-caption q-my-sm"
    >
      <q-markdown>{{ schema.description.trim() }}</q-markdown>
    </span>
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

export default {
  name: 'formSchemaLayout',

  props: {
    'forceDescription': Boolean
  },

  computed: {
    inlined () {
      return this.$parent.inlined
    },

    forceDescriptionParent () {
      return this.$parent.forceDescription
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


.form-schema-description
    display inline-block
    color $faded

.form-schema-error
  color $negative

</style>
