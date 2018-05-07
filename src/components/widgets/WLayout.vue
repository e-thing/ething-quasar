<template>
  <div class="column fit">
    <div class="col-auto text-center text-faded">
      {{ title }}
      <slot name="header"></slot>
    </div>
    <div class="col relative-position">
      <slot></slot>
    </div>
    <div class="col-auto text-center text-faded">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
    name: 'WLayout',

    props: ['title'],

}
</script>

<style scoped>

</style>
