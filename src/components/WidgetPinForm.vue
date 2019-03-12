<template>
  <modal icon="mdi-pin" ref="modal" :value="value" @input="$emit('input', $event)" title="Pin widget" v-bind="$attrs" size="lg" valid-btn-label="pin" :valid-btn-disable="optionsError" @valid="done">

      <div class="q-my-md">
        <div class="q-title q-my-md">Choose the widget type</div>
        <q-option-group
          color="secondary"
          type="radio"
          v-model="selectedWidgetId"
          :options="widgetNames"
        />
      </div>

      <div v-if="selectedWidgetOptions" class="q-my-md">
        <div class="q-title q-my-md">Options</div>
        <form-schema :schema="selectedWidgetOptions" v-model="options" @error="optionsError = $event"/>
      </div>

  </modal>
</template>

<script>
import {extend as extendSchema} from '../utils/schema'
import {dashboardWidgetSchemaDefaults} from '../core/widget'

export default {
  name: 'WidgetPinForm',

  props: ['value'],

  data () {

    return {
      selectedWidgetId: null,
      optionsError: false,
      options: {}
    }
  },

  computed: {

    widgetNames () {
      var n = []
      for (var id in this.$ethingUI.widgets) {
        var w = this.$ethingUI.widgets[id]
        var label = w.schema.title || w.schema.label
        if (w.schema.description) {
          label += ' ('+w.schema.description+')'
        }
        n.push({
          label,
          value: id
        })
      }
      return n
    },

    selectedWidget () {
      if (this.selectedWidgetId !== null) {
        return this.$ethingUI.widgets[this.selectedWidgetId]
      }
    },

    selectedWidgetOptions () {
      if (this.selectedWidget) {
        return extendSchema({}, dashboardWidgetSchemaDefaults, this.selectedWidget.schema)
      }
    }

  },

  methods: {



    done () {
      if (this.selectedWidget) {
        this.$emit('done', {
          widgetType: this.selectedWidgetId,
          options: this.options
        })

        this.$refs.modal.hide()
      }
    }

  }



}
</script>
