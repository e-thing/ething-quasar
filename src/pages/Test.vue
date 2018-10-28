<template>
  <q-page padding>

    <!--<input type="text" placeholder="Text input" />-->
    <q-btn @click="toto=!toto" label="tt" />

    <modal v-model="toto" title="Scheduler" icon="schedule">
      toto
    </modal>

  </q-page>
</template>

<script>

export default {
  name: 'PageTest',

  data () {

    return {
      toto: true
    }

  },
}
</script>
