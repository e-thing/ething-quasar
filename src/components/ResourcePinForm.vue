<template>
  <div>

    <div v-if="resources.length">

      <div class="row gutter-sm">
        <div class="resource" :class="resources.length>1 ? ('col-xs-12 col-sm-6 col-md-4 col-lg-3 ' + (pinned.find(id => id === r.id()) ? 'pinned' : '')) : 'col-xs-12'" v-for="r in resources" :key="r.id()">
          <q-card
            @click.native="select(r)"
            style="height: 100%" flat square
            class="cursor-pointer col-xs-12 col-sm-6"
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
          v-model="widgetType"
          :options="widgetNames"
        />
      </div>

      <form-schema v-if="widgetClassMetaOptions" :schema="widgetClassMetaOptions" v-model="options" @error="optionsError = $event"/>
    </div>

    <div class="q-mt-xl">
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

  </div>
</template>

<script>
import ResourceQItem from '../components/ResourceQItem'

export default {
  name: 'ResourcePinForm',

  components: {
    ResourceQItem
  },

  props: ['pinned'],

  data () {
      return {
        resource: null,
        resources: this.list(),
        widgetType: null,
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
          label: w.type,
          value: w.type
        }
      })
    },

    widget () {
      return this.widgets.find(w => w.type === this.widgetType)
    },

    widgetClass () {
      return this.$widget.find(this.widgetType)
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
      this.widgetType = this.widgets[0].type // default

      if (this.widgets.length === 1 && !this.widgetClassMetaOptions) {
        this.done()
      }
    },

    resetList () {
      this.resource = null
      this.resources = this.list()
    },

    done () {
      if (this.resource && this.widgetType) {
        this.$emit('done', {
          resource: this.resource,
          widget: this.widget,
          widgetType: this.widgetType,
          widgetClass: this.widgetClass,
          options: this.options
        })

        this.resetList()
      }
    }

  }



}
</script>

<style lang="stylus" scoped>
  @import '~variables'

  .resource
    transition all 0.3s ease

  .resource:hover
    opacity 0.7 !important

  .resource.pinned
    opacity 0.4

</style>
