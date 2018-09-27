<template>
  <q-page padding>

    <WMyLabel v-bind="opts" :value="45"/>

    <Widget :widgetClass="widget" :widgetOptions="opts" />

    <Widget widgetClass="WMyLabel" :widgetOptions="opts" />

  </q-page>
</template>

<script>

import Vue from 'vue'
import EThing from 'ething-js'
import { extend } from 'quasar'


Vue.config.optionMergeStrategies.metadata =
  Vue.config.optionMergeStrategies.data;

function mergeMetadata (a, b) {
  return extend(true, a, b)
}

function getMetadata (widget) {
  var wl = [widget]

  if (widget.mixins) {
    wl = wl.concat(widget.mixins)
  }
  if (widget.extend) {
    wl.push(widget.extend)
  }

  var mergedMetadata = {}
  wl.reverse().forEach(w => {
    var data = typeof w.metadata === 'function'
      ? w.metadata.call(w, w)
      : w.metadata
    if (data) {
      mergedMetadata = mergeMetadata(mergedMetadata, data)
    }
  })

  return mergedMetadata
}


var WWidget = Vue.component("WWidget", {
  template: `
    <div>
      {{ $attrs }} : {{ $props }}
      <button type="button" @click="error = 'somthing bad happen'">Set err</button>
    </div>
  `,
  props: {},
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
  methods: {},

  metadata() {
    return {
      label: null,
      description: null,
      minWidth: null,
      maxWidth: null,
      minHeight: null,
      maxHeight: null,
      options: {
        // a json schema describing the user options
        properties: {}
      }
    };
  }
});

var WLabel = Vue.component("WLabel", {
  mixins: [WWidget],
  props: {
    value: {
      type: Number,
      default: 0
    },
    unit: {
      type: String,
      default: "-"
    }
  },
  metadata() {
    return {
      label: "label",
      options: {
        // a json schema describing the user options
        properties: {
          unit: {
            type: "string"
          }
        }
      }
    };
  }
});

var WMyLabel = Vue.component("WMyLabel", {
  mixins: [WLabel],
  props: {
    unit: {
      default: "°C"
    }
  }
});

// wrapper for widgets
var Widget = Vue.component("Widget", {
  template: `
    <div class="widget" :class="{'widget-err': error, 'fit': inline}" :style="style">
      <div v-if="error" class="widget-err-layer absolute-center text-center">error</div>
      <div v-else class="widget-content-layer">
        <template v-if="isDynReg">
          <div ref="dynW" />
        </template>
        <component v-else ref="staticW" :is="widgetClass" v-bind="widgetOptions" @error="error = $event"/>
      </div>
    </div>
  `,
  props: {
    widgetClass: {},
    widgetOptions: {},
    inline: Boolean
  },
  data() {
    return {
      error: false,
      widgetInstance: null
    };
  },
  computed: {
    isDynReg() {
      return typeof this.widgetClass !== "string";
    },
    style () {
      var style = {}

      if (this.widgetInstance) {
        var metadata = this.widgetInstance.constructor.options.metadata
        if (metadata.minWidth) {
          style.minWidth = metadata.minWidth + 'px'
          if (this.inline) {
            style.width = style.minWidth
          }
        }
        if (metadata.minHeight) {
          style.minHeight = metadata.minHeight + 'px'
          style.height = this.inline ? style.minHeight : '1px'
        }
      }

      return style
    }
  },
  mounted() {
    if (this.isDynReg) {
      // create constructor
      var WidgetComponent = Vue.extend(this.widgetClass);

      // create an instance of WidgetComponent and mount it
      var WidgetComponentInstance = new WidgetComponent({
        propsData: this.widgetOptions
      });

      WidgetComponentInstance.$on("error", evt => {
        this.error = evt;
      });

      WidgetComponentInstance.$mount(this.$refs.dynW);

      this.widgetInstance = WidgetComponentInstance
    } else {
      this.widgetInstance = this.$refs.staticW
    }
  },
  methods: {
    hasContentOverflow () {
      var el = null
      if (this.isDynReg) {
        el = this.$refs.dynW
      } else {
        if (this.$refs.staticW) {
          el = this.$refs.staticW.$el
        }
      }
      if (el) {
        return el.scrollWidth > el.clientWidth
      }
      return false
    }
  }
});


export default {
  name: 'PageTest',

  data () {

    return {
      opts: {
        value: 35
      },
      widget: {
        mixins: [WLabel],
        props: {
          unit: {
            default: "°F"
          }
        }
      }
    }

  },
}
</script>
