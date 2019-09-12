<template>
  <div class="column fit justify-center q-pa-sm no-wrap">
    <template v-for="(item, index) in items">
      <div class="col-auto item row">
        <div class="col-auto" v-if="__hasIcons">
          <q-icon v-if="__getProp(item, 'icon')" :name="__getProp(item, 'icon')" style="vertical-align: baseline;" left/>
          <q-icon v-else name="mdi-minus" style="vertical-align: baseline; visibility: hidden;" left/>
        </div>
        <div class="col ellipsis" v-if="__getProp(item, 'label')">
          <span>{{ __getProp(item, 'label') }}</span>
        </div>
        <span class="text-bold col-auto">{{ __getProp(item, 'value') }}</span>
        <span v-if="__getProp(item, 'unit')" class="col-auto">{{ __getProp(item, 'unit') }}</span>
      </div>
    </template>
  </div>
</template>

<script>
import Base from '../Base'

export default {
    name: 'WMultiLabel',

    mixins: [Base],

    props: {
      items: Array,
    },

    computed: {
      __hasIcons () {
        for (var i in this.items) {
          var item = this.items[i]
          if (this.__getProp(item, 'icon')) return true
        }
      }
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
      },
      __getProp (item, prop) {
        var value = item[prop];
        if (typeof value == 'function') {
          try {
            value = value.call(this)
          } catch (err) {
            console.error(err)
            value = undefined
          }
        }
        return value
      },
    },

}
</script>
