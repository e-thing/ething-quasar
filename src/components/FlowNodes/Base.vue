<template>
  <strong>{{ node.name }}</strong>
</template>

<script>

export default {
    name: 'NodeBase',

    props: ['flow', 'node'],
}

</script>
