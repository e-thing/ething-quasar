<template>
  <q-input
    v-model="__value"
    v-bind="$attrs"
    :class="elementId"
  >
    <template v-slot:append v-if="__enabled">
      <q-icon :name="isMenuOpen ? 'arrow_drop_up' : 'arrow_drop_down'" class="cursor-pointer">
        <q-menu fit :target="'.' + elementId" :max-height="maxHeight" no-focus @show="__menuShow" @hide="__menuHide">
          <div v-if="loading" class="q-ma-md text-center text-faded">
            <div class="q-ma-md">loading...</div>
            <q-spinner-oval color="faded" size="36px" />
          </div>
          <div v-else>
            <div v-if="!c_items || c_items.length===0" class="q-ma-md text-center text-faded">
              <div>{{ emptyMessage }}</div>
              <q-btn flat color="faded" icon="refresh" label="refresh" size="sm" @click="__async()" v-if="__isAsync"/>
            </div>
            <q-list separator dense v-else>
              <q-item
                v-close-popup
                clickable
                v-for="(item, index) in c_items"
                :key="index"
                @click="__value = item.value"
                :class="{selected: item.value===__value}"
              >
                <slot name="item-content" v-bind:item="item">
                  <q-item-section>{{ item.label || item.value }}</q-item-section>
                </slot>
              </q-item>
              <q-btn flat color="faded" icon="refresh" label="refresh" size="sm" @click="__async()" v-if="__isAsync"/>
            </q-list>
          </div>
        </q-menu>
      </q-icon>
    </template>
  </q-input>
</template>

<script>

export default {
  name: 'Combobox',

  inheritAttrs: false,

  props: {
    value: {},
    items: {},
    maxHeight: {
      type: String,
      default: '200px'
    },
    emptyMessage: {
      type: String,
      default: 'empty'
    },
  },

  data () {
    return {
      elementId: '__id_' + this.$ethingUI.utils.generateId(),
      isMenuOpen: false,
      loading: false,
      c_items: null
    }
  },

  computed: {
    __isAsync () {
      return typeof this.items === 'function'
    },
    __enabled () {
      return this.__isAsync || (Array.isArray(this.items) && this.items.length>0)
    },
    __value: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  },

  watch: {
    items: {
      handler (val) {
        if (Array.isArray(val)) {
          this.__setItems(val)
        } else if (typeof val === 'function') {
          this.c_items = null
        }
      },
      immediate: true,
    }
  },

  methods: {
    __menuShow () {
      this.isMenuOpen = true
      // async ?
      if (this.__isAsync && this.c_items === null && !this.loading) {
        this.__async()
      }
    },
    __menuHide () {
      this.isMenuOpen = false
    },
    __async () {
      this.loading = true
      var done = (items) => {
        this.__setItems(items)
        this.loading = false
      }
      this.items(done)
    },
    __setItems (items) {
      this.c_items = (items || []).map(item => {
        if (typeof item === 'string') {
          item = {
            value: item,
            label: item
          }
        } else {
          item = Object.assign({}, item) // copy
        }
        return item
      })
    }
  }

}

</script>

<style lang="stylus" scoped>
  .selected {
    color $deep-orange
  }
</style>
