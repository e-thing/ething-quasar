<template>
  <form-schema-layout class="form-schema-ething-flow-node">
    <flow-node-select
      :value="c_value"
      @input="c_value = $event"
      :filter="computed_filter"
      :multiple="multiple"
      :flow="flow"
      use-id
    />
  </form-schema-layout>
</template>

<script>

import FlowNodeSelect from '../../../components/FlowNodeSelect'
import { FormComponent } from '../core'


/*
options
$flow: '$context' | id | Resource | f() => id|resource // a flow instance, only the nodes for that flow will be listed
$filter: f(flow, node) => boolean // filter the displayed nodes
*/

export default {
  name: 'FormSchemaEthingFlowNode',

  mixins: [FormComponent],

  components: {
    FlowNodeSelect
  },

  computed: {
    multiple () {
      return this.c_schema.type === 'array'
    },
    computed_filter () {
      var schema = this.c_schema

      return (flow, node) => {
        return this.filter(flow, node, schema)
      }
    },
    flow () {
      var flow = this.c_schema['$flow']
      if (flow === '$context') {
        flow = this.getContext('flow')
      }
      if (typeof flow === 'function') {
        flow = flow.call(this.c_schema)
      }
      return flow
    }
  },

  methods: {
    filter (flow, node, schema) {
      var filter = schema['$filter']
      if (filter) {
        if (!filter.call(schema, flow, node)) return false
      }
      return true
    }
  }

}

</script>
