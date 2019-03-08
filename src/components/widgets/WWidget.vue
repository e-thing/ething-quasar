
<script>

import Vue from 'vue'
import { extend } from 'quasar'

Vue.config.optionMergeStrategies.metadata = function (parent, child) {
	if (!child) {
    return parent
  }
  if (!parent) {
    return child
  }

  return function () {
  	var args = arguments
  	var _parent = typeof parent === 'function' ? parent.apply(this, args) : parent
    var _child = typeof child === 'function' ? child.apply(this, args) : child
    return extend(true, {}, _parent || {}, _child || {})
  }
}

export default {

  name: 'WWidget',
  
  inheritAttrs: false,

  props: {
    color: {
      type: String,
      default: '#027be3'
    },
    bgColor: {
      type: String,
      default: '#ffffff'
    }
  },

  data() {
    return {
      error: false
    };
  },
  watch: {
    error(value, oldValue) {
      this.$emit("error", value);
    }
  },
  methods: {
    setError (err) {
      this.error = err
    }
  },

  errorHandler: function (err, vm, info) {
    this.error = String(err)
  },

  metadata: {
    label: 'widget',
    description: null,
    minWidth: null,
    maxWidth: null,
    minHeight: null,
    maxHeight: null,
    options: {
      // a json schema describing the user options
      properties: {
        color: {
          type: 'string',
          '$component': 'color',
          description: 'The color of the widget',
          default: '#027be3'
        },
        bgColor: {
          title: 'background color',
          type: 'string',
          '$component': 'color',
          description: 'The color of the widget\'s background',
          default: '#ffffff'
        }
      }
    }
  }
}
</script>
