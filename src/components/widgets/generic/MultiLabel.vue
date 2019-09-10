<template>
  <div class="column fit justify-center q-pa-sm no-wrap">
    <template v-for="(item, index) in items">
      <div class="col-auto item row">
        <div class="col ellipsis" v-if="item.label">
          <q-icon v-if="item.icon" :name="item.icon" style="vertical-align: baseline;"/>
          <span>{{ item.label }}</span>
        </div>
        <span class="text-bold col-auto">{{ __value(item) }}</span>
        <span v-if="item.unit" class="col-auto">{{ item.unit }}</span>
      </div>
    </template>
  </div>
</template>

<script>
import Base from '../WWidget'

export default {
    name: 'WMultiLabel',

    mixins: [Base],

    props: {
      items: Array,
    },

    methods: {
      __value (item) {
        var value = item.value;
        if (typeof value == 'function') {
          try {
            value = value()
          } catch (err) {
            console.error(err)
            value = '?'
          }
        }
        return value
      }
    },

}
</script>
