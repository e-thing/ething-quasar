<template>
  <div>

    <resource-select
      v-model="resource"
      clearable
      label="Resource Filter"
      stack-label
      borderless
    />

    <q-list class="q-mt-lg">
      <q-item tag="label" v-for="(item, index) in widgetsSelect" :key="index">
        <q-item-section side top>
          <q-radio v-model="widgetId" :val="item.value" />
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ item.label }} ({{item.value}}) <q-icon v-if="item.icon" :name="item.icon"/></q-item-label>
          <q-item-label caption>
            {{ item.description }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>

    <template v-if="__widget">
      <div class="q-mt-lg">
        <q-toggle v-model="werror" label="error"/>
        <q-toggle v-model="winline" label="inline"/>
        <q-input v-model.number="fontSize" label="fontSize" type="number" class="q-mx-md inline"/>
        <q-toggle v-model="wdark" label="dark"/>
      </div>

      <div :style="{fontSize: fontSize+'px'}" class="container q-mt-lg">

        <template v-for="size in sizes">
          <div :style="{height: size.height+'px', width: size.width+'px'}" style="border: 1px solid grey" class="relative-position float-left q-mb-md q-mr-md">
            <widget
              ref="widget"
              :inline="winline"
              :color="wdark ? 'white': 'primary'"
              :bg-color="wdark ? 'primary': 'white'"

              title="$default"

              :resource="resource"

              :widget="__widget"
            />
          </div>
        </template>

      </div>
    </template>

  </div>
</template>

<script>

export default {
  name: 'TestWidget',

  data () {

    return {
      resource: null,
      widgetId: null,
      wdark: false,
      fontSize: 16,
      winline: false,
      werror: false,
      sizes: [{
        width: 128,
        height: 128,
      }, {
        width: 350,
        height: 350,
      }, {
        width: 600,
        height: 128,
      }, {
        width: 128,
        height: 600,
      }],
      widgetsSelect: [],
      widgets: {}
    }

  },

  computed: {

    __resourceId () {
      return this.resource ? this.resource.id() : null
    },

    __widget () {
      if (!this.widgetId) return
      return this.widgets[this.widgetId]
    }
  },

  watch: {
    werror (val) {
      this.$refs.widget.forEach(el => {
        if (val) el.setError('error: foobar')
        else el.setError(null)
      })
    },
    __resourceId : {
      handler (id) {
        var ret = []

        if (this.resource) {
          var widgets = this.widgets = this.$ethingUI.get(this.resource).widgets || {}

          for(var k in widgets) {
            var widget = widgets[k]
            if (!widget.disable) {
              ret.push({
                icon: widget.icon,
                label: widget.title,
                value: k,
                description: widget.description
              })
            }
          }
        } else {
          this.widgets = {}
        }

        this.widgetsSelect = ret
      },
      immediate: true
    }
  },
}
</script>

<style lang="stylus">
.container::after {
   content: "";
   display: block;
   clear: both;
}

</style>
