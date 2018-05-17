<template>
  <div>

    <div v-if="resources.length">

      <div>
        <q-card
          v-for="r in resources" :key="r.id()" @click.native="select(r)"
          inline style="width: 200px; height: 81px" flat square
          class="cursor-pointer resource q-ma-xs"
          :color="$meta.get(r).color"
          text-color="white"
        >
          <q-card-title >
            {{ r.basename() }}
            <span v-if="r.createdBy()" slot="subtitle">{{ $ething.arbo.get(r.createdBy()).basename() }}</span>
            <q-icon slot="right" :name="$meta.get(r).icon" color="white"/>
          </q-card-title>
          <!--<q-card-separator />
          <q-card-main>
            Card Content
          </q-card-main>-->
        </q-card>
      </div>
      <!--
      <q-list link no-border>
        <resource-q-item v-for="r in resources" :key="r.id()" :resource="r" @click.native="select(r)" readonly/>
      </q-list>
      -->
      <q-btn v-if="resource" flat color="faded" label="change" icon="replay" @click="resetList"/>
    </div>
    <q-alert v-else
      type="warning"
      class="q-mb-sm"
    >
      No resource found !
    </q-alert>

    <div v-if="resource">

      <div v-if="widgets.length > 1">
        <div>Choose the widget type</div>
        <q-option-group
          color="secondary"
          type="radio"
          v-model="widgetName"
          :options="widgetNames"
        />
      </div>

      <form-schema v-if="widgetClassMetaOptions" :schema="widgetClassMetaOptions" v-model="options" @error="optionsError = $event"/>
    </div>

    <q-btn
      v-if="resource"
      color="primary"
      @click="done"
      label="pin"
      :disable="optionsError"
    />
    <q-btn
      flat
      color="negative"
      @click="$emit('cancel')"
      label="Cancel"
    />

  </div>
</template>

<script>
import ResourceQItem from '../components/ResourceQItem'

export default {
  name: 'ResourcePinForm',

  components: {
    ResourceQItem
  },

  data () {
      return {
        resource: null,
        resources: this.list(),
        widgetName: null,
        optionsError: false,
        options: {}
      }
  },

  computed: {

    widgets () {
      if (!this.resource) return
      return this.$meta.get(this.resource).widgets
    },

    widgetNames () {
      return (this.widgets || []).map(w => {
        return {
          label: w.name,
          value: w.name
        }
      })
    },

    widget () {
      return this.widgets.find(w => w.name === this.widgetName)
    },

    widgetClass () {
      return this.$widget.find(this.widgetName)
    },

    widgetClassMeta () {
      return this.widgetClass ? this.widgetClass.meta : {}
    },

    widgetClassMeta () {
      return this.widgetClass ? this.widgetClass.meta : {}
    },

    widgetClassMetaOptions () {
      return this.widgetClassMeta.options ? Object.assign({type: 'object'},this.widgetClassMeta.options) : null
    }


  },

  methods: {

    list () {
      return this.$store.getters['ething/filter']((r) => this.$meta.get(r).widgets.length)
    },

    select (resource) {
      console.log('res selected:', resource)
      this.resource = resource
      this.resources = [resource]
      this.options = {}
      this.optionsError = false
      this.widgetName = this.widgets[0].name // default

      if (this.widgets.length === 1 && !this.widgetClassMetaOptions) {
        this.done()
      }
    },

    resetList () {
      this.resource = null
      this.resources = this.list()
    },

    done () {
      if (this.resource && this.widgetName) {
        this.$emit('done', {
          resource: this.resource,
          widget: this.widget,
          widgetName: this.widgetName,
          widgetClass: this.widgetClass,
          options: this.options
        })
      }
    }

  }



}
</script>

<style lang="stylus" scoped>
  @import '~variables'

</style>
