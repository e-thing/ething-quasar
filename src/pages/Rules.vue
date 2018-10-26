<template>
  <q-page padding>

    <div v-if="rules.length">
      <q-btn flat label="Add" icon="add" color="secondary" @click="add"/>
      <q-btn flat label="Emit custom event" icon="wifi_tethering" color="secondary" @click="emitCustomEvent"/>

      <q-list no-border>
        <q-collapsible indent v-for="rule in rules" :key="rule.id()" popup >
          <template slot="header">
            <q-item-side :icon="$ethingUI.get(rule).icon" inverted :color="color(rule)" />
            <q-item-main>
              <q-item-tile label>{{ rule.basename() }}</q-item-tile>
              <q-item-tile sublabel>{{ $ethingUI.utils.dateToString(rule.modifiedDate()) }}</q-item-tile>
            </q-item-main>
            <q-item-side right>
              <q-btn rounded icon="play arrow" :loading="loading" label="execute" flat dense @click.stop="execute(rule)"/>
            </q-item-side>
            <q-item-side right>
              <q-btn icon="settings" round flat dense @click.stop="$router.push('/resource/' + rule.id())"/>
            </q-item-side>
            <q-item-side right>
              <q-btn icon="delete" round flat dense @click.stop="remove(rule)"/>
            </q-item-side>

          </template>

          <q-item multiline v-if="rule.description()">
            <q-item-main class="text-faded">
              {{ rule.description() }}
            </q-item-main>
          </q-item>

          <q-item multiline v-if="rule.attr('execution_error')">
            <q-item-main inset>
              <q-alert type="negative">
                {{ rule.attr('execution_error') }}
              </q-alert>
            </q-item-main>
          </q-item>

          <q-item multiline>
            <q-item-side icon="list" />
            <q-item-main>
              <q-item-tile label>Attributes</q-item-tile>
              <q-item-tile sublabel>executed: {{ rule.executionCount() }} times</q-item-tile>
              <q-item-tile sublabel>last executed time: {{ rule.executionDate() ? $ethingUI.utils.dateToString(rule.executionDate()) : 'never' }}</q-item-tile>
            </q-item-main>
          </q-item>

          <q-item multiline v-for="(event, i) in rule.attr('events', [])" :key="'event-'+i">
            <q-item-side icon="event" />
            <q-item-main>
              <q-item-tile v-if="rule.attr('events', []).length>1" label>Event {{ i + 1 }} : {{ formatType(event.type) }}</q-item-tile>
              <q-item-tile v-else label>Event : {{ formatType(event.type) }}</q-item-tile>
              <q-item-tile sublabel v-for="(attr, index) in listAttr(event, 'events')" :key="index" >
                <template v-if="!!attr.name">
                  {{ attr.name }}:
                </template>
                <template v-if="attr.type === 'resources'">
                  <template v-for="(r, j) in resolve(attr.value)">
                    <span v-if="j > 0">, </span>
                    <span class="cursor-pointer" @click.stop="$ethingUI.open(r)">{{ r.basename() }}</span>
                  </template>
                </template>
                <template v-else>{{ attr.label }}</template>
              </q-item-tile>
            </q-item-main>
          </q-item>

          <q-item multiline v-for="(condition, i) in rule.attr('conditions', [])" :key="'condition-'+i">
            <q-item-side icon="mdi-help" />
            <q-item-main>
              <q-item-tile v-if="rule.attr('conditions', []).length>1" label>Condition {{ i + 1 }} : {{ formatType(condition.type) }}</q-item-tile>
              <q-item-tile v-else label>Condition : {{ formatType(condition.type) }}</q-item-tile>
              <q-item-tile sublabel v-for="(attr, index) in listAttr(condition, 'conditions')" :key="index" >
                <template v-if="!!attr.name">
                  {{ attr.name }}:
                </template>
                <template v-if="attr.type === 'resources'">
                  <template v-for="(r, j) in resolve(attr.value)">
                    <span v-if="j > 0">, </span>
                    <span class="cursor-pointer" @click.stop="$ethingUI.open(r)">{{ r.basename() }}</span>
                  </template>
                </template>
                <template v-else>{{ attr.label }}</template>
              </q-item-tile>
            </q-item-main>
          </q-item>

          <q-item multiline v-for="(action, i) in rule.attr('actions', [])" :key="'action-'+i">
            <q-item-side icon="mdi-play" />
            <q-item-main>
              <q-item-tile v-if="rule.attr('actions', []).length>1" label>Action {{ i + 1 }} : {{ formatType(action.type) }}</q-item-tile>
              <q-item-tile v-else label>Action : {{ formatType(action.type) }}</q-item-tile>
              <q-item-tile sublabel v-for="(attr, index) in listAttr(action, 'actions')" :key="index" >
                <template v-if="!!attr.name">
                  {{ attr.name }}:
                </template>
                <template v-if="attr.type === 'resources'">
                  <template v-for="(r, j) in resolve(attr.value)">
                    <span v-if="j > 0">, </span>
                    <span class="cursor-pointer" @click.stop="$ethingUI.open(r)">{{ r.basename() }}</span>
                  </template>
                </template>
                <template v-else>{{ attr.label }}</template>
              </q-item-tile>
            </q-item-main>
          </q-item>

        </q-collapsible>
      </q-list>
    </div>

    <div v-else class="absolute-center text-center">
      <p>
        <img
          src="~assets/sad.svg"
          style="width:30vw;max-width:150px;"
        >
      </p>
      <p class="text-faded">No rules !</p>
      <q-btn label="Add" icon="add" color="secondary" @click="add"/>
    </div>

  </q-page>
</template>

<script>

import cronstrue from 'cronstrue'
import FormSchemaScheduler from 'ething-quasar-core/src/plugins/formSchema/FormSchemaScheduler'


export default {
  name: 'PageRules',

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
      rule.execute().then(res => {

      }).catch(err => {
        console.error(err)
      }).finally(() => {
        this.loading = false
      })
    },

    remove (rule) {
      var name = rule.name()

      return this.$q.dialog({
        title: 'Remove',
        message: 'Do you really want to remove definitely the Rule "' + name + '" ?',
        ok: 'Remove',
        cancel: 'Cancel'
      }).then((data) => {
        rule.remove().then( () => {
          this.$q.notify('"' + name + '" removed !')
        })
      })
    },

    color (rule) {
      if (rule.enabled()) {
        if (rule.attr('execution_error')) {
          return 'negative'
        } else {
          return this.$ethingUI.get(rule).color
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
    },

    add () {
      this.$router.push('/create/Rule')
    },

    listAttr (item, type) {
      var attrs = []
      var schema = this.$ethingUI.get(item.type)

      for(var k in item) {
        if (k!=='type') {
          var attrSchema = (schema.properties || {})[k]
          if (attrSchema) {
            var value = item[k]
            var label = String(value)
            if (label && value!==null && typeof value != 'undefined' && !(typeof value == 'object' && Object.keys(value).length==0)) {

              var type = ''

              if (attrSchema.format === 'ething.resource') {
                if (this.$ething.utils.isId(value)) {
                  value = [value]
                }
                if(Array.isArray(value)) {
                  type = 'resources'
                }
              }
              else if(attrSchema.format === 'cron') {
                label = cronstrue.toString(value)
              }
              else if(attrSchema.format === 'scheduler') {
                for (var i in value) {
                  attrs.push({
                    name: null,
                    schema: attrSchema,
                    value: value[i],
                    label: FormSchemaScheduler.methods.toString(value[i]),
                    type
                  })
                }
                continue
              }

              attrs.push({
                name: attrSchema.title || k,
                schema: attrSchema,
                value,
                label,
                type
              })

            }
          }
        }
      }

      return attrs
    },

    resolve (resources) {
      return resources.map(id => {
        if (this.$ething.utils.isId(id)) {
          var r = this.$ething.arbo.get(id)
          return r || id
        }
      })
    },

    formatType (type) {
      return type.split('/').pop()
    },

  }

}
</script>

<style>
</style>
