<template>
  <div class="column">
    <div class="col-auto text-center text-faded ellipsis" v-if="!noHeader">
      {{ title }}
      <slot name="header"></slot>
    </div>
    <div class="col relative-position">
      <slot></slot>
    </div>
    <div class="col-auto text-center text-faded ellipsis" v-if="!noFooter">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
    name: 'WLayout',

    props: {
      title: String,
      noHeader: Boolean,
      noFooter: Boolean
    },

}
</script>

<style scoped>

</style>
