<template>
  <q-scroll-area class="column fit justify-center q-pa-md no-wrap">

    <div
      class="col-auto item row items-center q-my-xs cursor-pointer"
      @click="__toggle(resource)"
    >
      <div class="col ellipsis text-secondary">
        ALL
      </div>
      <div class="col-auto">
        <q-icon :name="__state(resource) ? 'mdi-lightbulb-on' : 'mdi-lightbulb-outline'" :color="__state(resource) ? 'primary' : 'light'" style="font-size: 2em;"/>
      </div>
    </div>

    <div
      class="col-auto"
    >
      <q-separator color="secondary" spaced style="opacity: 0.3;"/>
    </div>

    <div
      class="col-auto item row items-center q-my-xs cursor-pointer"
      v-for="r in items" :key="r.id()"
      @click="__toggle(r)"
    >
      <div class="col ellipsis">
        {{ r.name() }}
      </div>
      <div class="col-auto">
        <q-icon :name="__state(r) ? 'mdi-lightbulb-on' : 'mdi-lightbulb-outline'" :color="__state(r) ? 'primary' : 'light'" style="font-size: 2em;"/>
      </div>
    </div>
  </q-scroll-area>
</template>

<script>
import Base from './Base'

export default {
    name: 'WLightGroupToggle',

    mixins: [Base],

    data () {
      return {

      }
    },

    computed: {

      items () {
        var items = []
        this.resource.attr('items').forEach(id => {
          var r = this.$ething.arbo.get(id)
          if (r) {
            items.push(r)
          }
        })
        return items
      },

    },

    methods: {

      __state (r) {
        return r.attr('state')
      },

      __toggle (r) {
        this.__setState(r, !this.__state(r))
      },

      __setState (r, state) {
        r.execute('setState', !!state)
      }
    }


}
</script>
