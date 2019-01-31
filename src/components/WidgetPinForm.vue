<template>
  <modal icon="mdi-pin" ref="modal" :value="value" @input="$emit('input', $event)" title="Pin widget" v-bind="$attrs" size="lg" valid-btn-label="pin" :valid-btn-disable="optionsError" @valid="done">

      <div class="q-my-md">
        <div class="q-title q-my-md">Choose the widget type</div>
        <q-option-group
          color="secondary"
          type="radio"
          v-model="selectedWidgetIndex"
          :options="widgetNames"
        />
      </div>

      <div v-if="selectedWidgetMetaOptions" class="q-my-md">
        <div class="q-title q-my-md">Options</div>
        <form-schema :schema="selectedWidgetMetaOptions" v-model="options" @error="optionsError = $event"/>
      </div>

  </modal>
</template>

<script>

import Vue from 'vue'


function list_mixins (widget) {
  var mixins = [widget.name]
  if (widget.mixins) {
    for (var i in widget.mixins) {
      mixins = mixins.concat(list_mixins(widget.mixins[i]))
    }
  }
  if (widget.extends) {
    mixins.push(widget.extends.name)
  }
  return mixins.filter((value, index, self) => { // uniq
      return self.indexOf(value) === index;
  })
}

function filter_no_resource_widget_only (widgets) {
  return Object.keys(widgets).map(k => widgets[k]).filter(w => {
    var mixins = list_mixins(w)
    return w.name !== 'WWidget' && mixins.indexOf('WWidget') !== -1 && mixins.indexOf('WResource') === -1
  })
}


export default {
  name: 'WidgetPinForm',

  props: ['value'],

  data () {

    var widgets = filter_no_resource_widget_only(this.$ethingUI.widgets).map(w => {
      var component = Vue.extend(w)
      var metadata = component.options.metadata
      return {
        name: w.name,
        'metadata': typeof metadata === 'function' ? metadata.call(this, this.resource) : metadata
      }
    })

    return {
      selectedWidgetIndex: null,
      widgets,
      optionsError: false,
      options: {}
    }
  },

  computed: {

    widgetNames () {
      return this.widgets.map((w, index) => {
        return {
          label: w.metadata.title,
          value: index
        }
      })
    },

    selectedWidget () {
      if (this.selectedWidgetIndex !== null) {
        return this.widgets[this.selectedWidgetIndex]
      }
    },

    selectedWidgetMeta () {
      return this.selectedWidget ? this.selectedWidget.meta : {}
    },

    selectedWidgetMetaOptions () {
      if (this.selectedWidget) {
        var metadata = this.selectedWidget.metadata
        if (metadata.options && metadata.options.properties && Object.keys(metadata.options.properties).length>0) {
          return Object.assign({ type: 'object' }, metadata.options)
        }
      }
    }

  },

  methods: {



    done () {
      if (this.selectedWidget) {
        this.$emit('done', {
          widgetType: this.selectedWidget.name,
          options: this.options
        })

        this.$refs.modal.hide()
      }
    }

  }



}
</script>
