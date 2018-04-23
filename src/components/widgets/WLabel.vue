<template>
  <div class="absolute-center">
    <span class="value">
        {{ value }}
    </span>
    <span class="unit">
        {{ unit }}
    </span>
  </div>
</template>

<script>
export default {
    name: 'WLabel',

    data () {
        return {
            value: 0,
            unit: ""
        }
    },

}
</script>

<style scoped>

</style>
