<template>
  <modal icon="mdi-pin" ref="modal" :value="value" @input="$emit('input', $event)" title="Pin widget" v-bind="$attrs" size="lg" valid-btn-label="pin" :valid-btn-disable="optionsError" @valid="done">

      <div class="q-my-md">
        <div class="text-h6 q-my-md">Choose the widget type</div>
        <q-option-group
          color="secondary"
          type="radio"
          v-model="selectedWidgetId"
          :options="widgetNames"
        />
      </div>

      <div v-if="selectedWidgetOptions" class="q-my-md">
        <div class="text-h6 q-my-md">Options</div>
        <form-schema :key="formKey" :schema="selectedWidgetOptions" v-model="options" @error="optionsError = $event"/>
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
      options: {},
      formKey: 0
    }
  },

  watch: {
    selectedWidgetId () {
      this.formKey++
      this.options = {}
    }
  },

  computed: {

    widgetNames () {
      var n = []
      for (var id in this.$ethingUI.widgets) {
        var w = this.$ethingUI.widgets[id]
        var label = w.title || w.schema.title || w.schema.label
        var description = w.description || w.schema.description

        if (description) {
          label += ' ('+description+')'
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
        var schema = extendSchema(dashboardWidgetSchemaDefaults(this.selectedWidget), this.selectedWidget.schema)

        // default title to the title of the widget


        return schema
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
