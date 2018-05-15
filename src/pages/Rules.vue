<template>
  <q-page padding>

    <q-btn flat label="Add" icon="add" color="secondary" @click="$router.push('/create/Rule')"/>
    <q-btn flat label="Emit custom event" icon="wifi_tethering" color="secondary" @click="emitCustomEvent"/>

    <q-list no-border>
      <q-collapsible indent v-for="rule in rules" :key="rule.id()" popup >
        <template slot="header">
          <q-item-side :icon="$meta.get(rule).icon" inverted :color="color(rule)" />
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
            <q-item-tile sublabel>last executed time: {{ rule.scriptExecutionDate() ? $ui.dateToString(rule.scriptExecutionDate()) : 'never' }}</q-item-tile>
            <q-item-tile sublabel>last execution status:
              <span v-if="rule.scriptReturnCode()" class="text-negative">
                code {{ rule.scriptReturnCode() }} (error)
              </span>
              <template v-else>ok</template>
            </q-item-tile>
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
      loading: false,
      emitCustomEventName: ''
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
    },

    color (rule) {
      if (rule.enabled()) {
        if (rule.scriptReturnCode()) {
          return 'negative'
        } else {
          return this.$meta.get(rule).color
        }
      } else {
        return 'faded'
      }
    },

    emitCustomEvent () {
      this.$q.dialog({
        title: 'Emit a custom event',
        message: 'Enter the name of the event you want to send. All the rules binded to this custom event name will be triggered.',
        prompt: {
          model: this.emitCustomEventName,
          type: 'text' // optional
        },
        cancel: true,
        color: 'secondary'
      }).then(data => {
        data = data.trim()
        if (data) {
          this.emitCustomEventName = data
          this.$ething.request('/rules/trigger/' + encodeURIComponent(data))
        }
      }).catch(() => {

      })
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
