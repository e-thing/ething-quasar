<template>
  <strong>{{ node.name }}</strong>
</template>

<script>

export default {
    name: 'NodeBase',

    props: ['flow', 'node'],

    metadata: {
      height: 48,
      width: 200
    }
}

</script>
