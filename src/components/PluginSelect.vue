<template>
  <q-select
   v-model="model"
   :options="options"
   v-bind="$attrs"
   items-aligned
   options-selected-class="text-deep-orange"
   :virtual-scroll-slice-size="200"
   placeholder="Select a plugin"
  >
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey">
          No plugin available
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script>


export default {
    name: 'PluginSelect',

    props: {
      value: {},
      useType: Boolean,
    },

    data () {

      var options = this.$ethingUI.plugins.map(p => {

        var meta = this.$ethingUI.get(p)

        return {
          label: p.name(),
          value: p.type(),
          icon: meta.icon,
          color: meta.color,
          title: meta.title,
          plugin: p,
        }

      })

      return {
        options,
      }
    },

    computed: {

      model: {
        get: function () {
          if (this.selectedPlugin) {
            for (var i in this.options) {
              if (this.options[i].value === this.selectedPlugin.type()) {
                return this.options[i]
              }
            }
          }
        },
        set: function (val) {
          var m;
          if (!val) {
            m = null
          } else {
            m = this.useType ? val.value : val.plugin
          }
          this.$emit('input', m)
        }
      },

      selectedPlugin () {
        if (this.value) {
          return this.useType ? this.$ethingUI.findPlugin(this.value) : this.value
        }
      },
    },

    methods: {

    },


}
</script>
