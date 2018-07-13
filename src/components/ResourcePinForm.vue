<template>
  <modal icon="mdi-pin" ref="modal" :value="value" @input="$emit('input', $event)" title="Pin resource" v-bind="$attrs" size="lg" valid-btn-label="pin" :valid-btn-disable="!resource || optionsError" @valid="done">

    <div class="q-my-md">
      <div class="q-title q-my-md">Select the resource to pin</div>
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
              <q-card-title>
                <div class="ellipsis">{{ r.basename() }}</div>
                <div v-if="r.createdBy()" class="ellipsis" slot="subtitle">{{ $ething.arbo.get(r.createdBy()).basename() }}</div>
                <q-icon slot="right" :name="$meta.get(r).icon" color="white"/>
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

      <div v-if="widgets.length > 1" class="q-my-md">
        <div class="q-title q-my-md">Choose the widget type</div>
        <q-option-group
          color="secondary"
          type="radio"
          v-model="widgetType"
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
import ResourceQItem from '../components/ResourceQItem'

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
        var widgetClass = this.$widget.find(w.type)
        return {
          label: widgetClass.meta.name || w.type,
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
