<template>
  <modal icon="mdi-pin" ref="modal" :value="value" @input="$emit('input', $event)" title="Pin resource" v-bind="$attrs" size="lg" valid-btn-label="pin" :valid-btn-disable="!resource || optionsError" @valid="done">

    <div class="q-my-md">
      <div class="q-title q-my-md">Select the resource to pin</div>
      <div v-if="resources.length">

        <div class="row gutter-xs">
          <div class="resource" :class="resources.length>1 ? ('col-xs-12 col-sm-6 col-md-4 col-lg-3 ' + (pinned.find(id => id === r.id()) ? 'pinned' : '')) : 'col-xs-12'" v-for="r in resources" :key="r.id()">
            <q-card
              @click.native="select(r)"
              style="height: 100%" flat square
              class="cursor-pointer col-xs-12 col-sm-6"
              :color="$ethingUI.meta.get(r).color"
              text-color="white"
            >
              <q-card-title>
                <div class="ellipsis">{{ r.basename() }}</div>
                <div v-if="$ething.arbo.get(r.createdBy())" class="ellipsis" slot="subtitle">{{ $ething.arbo.get(r.createdBy()).basename() }}</div>
                <q-icon slot="right" :name="$ethingUI.meta.get(r).icon" color="white"/>
              </q-card-title>
            </q-card>
          </div>
        </div>
        <q-btn v-if="resource" flat color="faded" label="change" icon="replay" @click="resetList"/>
      </div>

      <q-alert v-else
        type="warning"
        class="q-mb-sm"
        :actions="[
          { label: 'Add Device', icon: 'add', handler: () => { this.$router.push('/devices') } }
        ]"
      >
        No resource found !
      </q-alert>
    </div>

    <div v-if="resource">

      <div v-if="Object.keys(widgets).length > 1" class="q-my-md">
        <div class="q-title q-my-md">Choose the widget type</div>
        <q-option-group
          color="secondary"
          type="radio"
          v-model="widgetId"
          :options="widgetNames"
        />
      </div>

      <div v-if="widgetClassMetaOptions" class="q-my-md">
        <div class="q-title q-my-md">Options</div>
        <form-schema :schema="widgetClassMetaOptions" v-model="options" @error="optionsError = $event"/>
      </div>

    </div>

  </modal>
</template>

<script>
import ResourceQItem from 'ething-quasar-core/src/components/ResourceQItem'

export default {
  name: 'ResourcePinForm',

  components: {
    ResourceQItem
  },

  props: ['pinned', 'value'],

  data () {
      return {
        resource: null,
        resources: this.list(),
        widgetId: null,
        optionsError: false,
        options: {}
      }
  },

  computed: {

    widgets () {
      if (!this.resource) return
      return this.$ethingUI.meta.get(this.resource).widgets
    },

    widgetNames () {
      var widgets = this.widgets || {}
      return Object.keys(widgets).map(k => {
        var w = widgets[k]
        return {
          label: w.label,
          value: k
        }
      })
    },

    widget () {
      return this.widgets[this.widgetId]
    },

    widgetClass () {
      return this.$ethingUI.widget.find(this.widget.type)
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
      return this.$store.getters['ething/filter']((r) => Object.keys(this.$ethingUI.meta.get(r).widgets).length)
    },

    select (resource) {
      this.resource = resource
      this.resources = [resource]
      this.options = {}
      this.optionsError = false
      this.widgetId = Object.keys(this.widgets)[0] // default

      if (Object.keys(this.widgets).length === 1 && !this.widgetClassMetaOptions) {
        this.done()
      }
    },

    resetList () {
      this.resource = null
      this.resources = this.list()
    },

    done () {
      if (this.resource && this.widgetId) {
        this.$emit('done', {
          resource: this.resource,
          widget: this.widget,
          widgetId: this.widgetId,
          widgetClass: this.widgetClass,
          options: this.options
        })

        this.resetList()

        this.$refs.modal.hide()
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
