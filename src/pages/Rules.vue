<template>
  <q-page padding>

    <div v-if="rules.length">
      <q-btn flat label="Add" icon="add" color="secondary" @click="add"/>
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
            <q-item-side right>
              <q-btn icon="delete" round flat dense color="negative" @click.stop="remove(rule)"/>
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

          <q-item multiline v-if="targets(rule).length">
            <q-item-side icon="mdi-link-variant" />
            <q-item-main>
              <q-item-tile label>Targets</q-item-tile>
              <q-item-tile v-for="target in targets(rule)" :key="target.id()" sublabel><q-btn dense outline color="secondary" :label="target.name()" :icon="$meta.get(target).icon" @click="$ui.open(target)"/></q-item-tile>
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

    remove (rule) {
      var name = rule.name()

      return this.$q.dialog({
        title: 'Remove',
        message: 'Do you really want to remove definitely the Rule "' + name + '" ?',
        ok: 'Remove',
        cancel: 'Cancel'
      }).then((data) => {
        rule.remove().then( () => {
          this.$q.notify(name + ' removed !')
        })
      })
    },

    targets (rule) {
      var resources = []
      var evtResources = rule.event().resource
      if (evtResources) {
        if (typeof evtResources === 'String' && this.$ething.utils.isId(evtResources)) {
          resources.push(evtResources)
        } else if (Array.isArray(evtResources)) {
          resources = evtResources.filter(this.$ething.utils.isId)
        }
      }

      if (resources.length) {

      }
      return resources.map(id => this.$ething.arbo.get(id)).filter(r => !!r)
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
    },

    add () {
      this.$router.push('/create/Rule')
    }
  }

}
</script>

<style>
</style>
