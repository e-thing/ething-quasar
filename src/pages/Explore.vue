<template>
  <q-page>
    <resource-list
      :resources="resources"
    />
  </q-page>
</template>

<script>

export default {
  name: 'PageExplore',

  props: ['resources'],
  
}
</script>
