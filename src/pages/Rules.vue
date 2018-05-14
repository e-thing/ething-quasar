<template>
  <q-page padding>

    <q-btn flat label="Add" icon="add" color="secondary" @click="$router.push('/create/Rule')"/>

    <q-list no-border>
      <q-collapsible indent v-for="rule in rules" :key="rule.id()" popup >
        <template slot="header">
          <q-item-side :icon="$meta.get(rule).icon" inverted :color="$meta.get(rule).color" />
          <q-item-main>
            <q-item-tile label>{{ rule.basename() }}</q-item-tile>
            <q-item-tile sublabel>{{ $ui.dateToString(rule.modifiedDate()) }}</q-item-tile>
          </q-item-main>
          <q-item-side right>
            <q-btn rounded icon="play arrow" :loading="loading" label="execute" flat dense @click.stop="execute(rule)"/>
          </q-item-side>
          <q-item-side right>
            <q-btn icon="settings" round flat dense @click.stop="$router.push('/resource/' + rule.id())"/>
          </q-item-side>
        </template>

        <q-item multiline>
          <q-item-side icon="list" />
          <q-item-main>
            <q-item-tile label>Attributes</q-item-tile>
            <q-item-tile sublabel>event: {{ rule.event().type }}</q-item-tile>
            <q-item-tile sublabel>executed: {{ rule.scriptExecutionCount() }} times</q-item-tile>
            <q-item-tile sublabel>executed time: {{ rule.scriptExecutionDate() ? $ui.dateToString(rule.scriptExecutionDate()) : 'never' }}</q-item-tile>
            <q-item-tile sublabel>execution status: {{ rule.scriptReturnCode() ? ('code '+rule.scriptReturnCode()+' (error)') : 'ok' }}</q-item-tile>
          </q-item-main>
        </q-item>

        <q-item multiline>
          <q-item-side icon="code" />
          <q-item-main>
            <q-item-tile label>Script</q-item-tile>
            <q-item-tile sublabel><q-btn dense outline color="secondary" :label="script(rule).name()" :icon="$meta.get(script(rule)).icon" @click="$ui.open(script(rule))"/></q-item-tile>
          </q-item-main>
        </q-item>


      </q-collapsible>
    </q-list>

    <div v-if="!rules.length">
      No rules !
    </div>

    <!--
    <q-modal v-model="edit.enable" :content-css="{padding: '50px', minWidth: '50vw'}">
      <div class="q-headline q-mb-md">Create a new rule</div>

      <q-field
        label="Name"
        helper="The name of this rule"
      >
        <q-input v-model="edit.name" />
      </q-field>

      <q-field
        label="Event"
        helper="Select the event on which this rule will be executed"
      >
        <q-select
          v-model="edit.event"
         :options="edit.eventOptions"
        />
      </q-field>

      <form-schema v-if="edit.event" :schema="editEventSchema" v-model="edit.model" @error="edit.error = $event"/>

      <q-field
        label="Script"
        helper="Select the script to be executed"
      >
        <resource-select :filter="edit.scriptFilter" v-model="edit.script" use-id/>
      </q-field>

      <q-btn
        color="primary"
        @click="create"
        label="Create"
        :disable="!edit.name || !edit.event || !edit.script || edit.error"
      />
      <q-btn
        flat
        color="negative"
        @click="edit.enable = false"
        label="Cancel"
      />
    </q-modal>
  -->

  </q-page>
</template>

<script>
//import ResourceSelect from '../components/ResourceSelect'

export default {
  name: 'PageRule',

  components: {
    //ResourceSelect
  },

  data () {
    return {
      loading: false
    }
  },

  computed: {
    rules () {
      return this.$store.getters['ething/filter']( (r) => r instanceof this.$ething.Rule )
    },
  },

  methods: {
    execute (rule) {
      this.loading = true
      rule.execute().finally(() => {
        this.loading = false
      })
    },

    script (rule) {
      return this.$ething.arbo.get(rule.script())
    }
  }


  /*
  data () {

    var eventOptions = []

    for (let k in this.$meta.events) {
      let event = this.$meta.events[k]
      eventOptions.push({
        label: k,
        value: k,
        sublabel: event.description
      })
    }

    return {
      edit: {
        enable: false,
        event: undefined,
        eventOptions,
        model: {},
        error: false,
        scriptFilter: (r) => {
          return (r instanceof this.$ething.File) && r.mime() == 'application/javascript'
        },
        script: undefined,
        name: undefined
      }
    }
  },

  watch: {
    ['edit.event'] (val) {
      // reset
      this.edit.model = {}
      this.edit.error = false
    }
  },

  computed: {
    rules () {
      return this.$store.getters['ething/filter']( (r) => r instanceof this.$ething.Rule )
    },

    editEventSchema () {
      var schema = {
          type: 'object',
          required: [],
          properties: {}
      }

      if (this.edit.event) {

        let meta = this.$meta.events[this.edit.event]

        var required = meta.required || []
        var properties = {}

        for(let k in meta.properties) {
          if (!meta.properties[k].readOnly) {
              properties[k] = meta.properties[k]
              if (meta.properties[k].required && required.indexOf(k)===-1) {
                  required.push(k)
              }
          }
        }

        schema.required = required
        schema.properties = properties

      }

      return schema
    }
  },

  methods: {
    addRule () {
      this.edit.enable = true
    },
    create () {

    }
  }*/

}
</script>

<style>
</style>
