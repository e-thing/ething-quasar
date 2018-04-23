<template>
  <div class="widget">
    <componant :is="type" v-bind="options" />
  </div>
</template>

<script>
import widgets from './widgets'

export default {
    name: 'Widget',

    components: widgets,

    props: ['type', 'options'],

    data () {
        return {}
    },

}
</script>

<style scoped>

</style>
