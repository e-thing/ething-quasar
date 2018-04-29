<template>
  <q-page>

    <q-btn-group flat >
      <q-btn :loading="saveLoading" label="save" @click="save"/>
      <q-btn-dropdown label="langage">
        <q-list link>
          <q-item v-for="(value, key, index) in langages()" :key="key" v-close-overlay @click.native="setLangage(key, value)">
            <q-item-main>
              <q-item-tile label>{{ key }}</q-item-tile>
            </q-item-main>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </q-btn-group>
    <span>{{ resource.name() }}</span>

    <codemirror v-model="content" :options="cmOption"></codemirror>

  </q-page>
</template>

<script>

import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript.js'

export default {
  name: 'PageText',

  components: {
    codemirror
  },

  data () {
    return {
      content: '',
      cmOption: {
        mode: 'text',
        tabSize: 4,
        styleActiveLine: true,
        lineNumbers: true,
        lineWrapping: false,
        foldGutter: true,
        styleSelectedText: true,
        mode: 'text/plain',
        matchBrackets: true,
        showCursorWhenSelecting: true,
        extraKeys: { "Ctrl": "autocomplete" },
        hintOptions:{
          completeSingle: false
        },
        viewportMargin: Infinity
      },
      loading: true,
      saveLoading: false
    }
  },

  computed: {
    resource () {
      console.log('resource computed !')
      var id = this.$route.params.id
      var r = this.$store.getters['ething/findOneById'](id)
      if (id && id.length) {
        if (!r) {
          this.$router.replace('/404')
        }
      }

      return r
    }
  },

  methods: {

    reloadContent () {
      this.loading = true
      this.resource.read().done( (data) => {
        this.content = data
      }).always( () => {
        this.loading = false
      })
    },

    langages () {
      return {
        'javascript': 'text/javascript',
        'yaml': 'text/x-yaml',
        'json': 'application/json'
      }
    },

    setLangage (langage, mime) {
      console.log('setLangage = ' + langage)
      this.cmOption.mode = mime

    },

    save () {
      this.saveLoading = true
      this.resource.write(this.content).always( () => {
        this.saveLoading = false
      })
    }
  },

  mounted () {
    // once mounted, we need to trigger the initial server data fetch
    this.reloadContent()
  }

}
</script>

<style>
.CodeMirror {
  height: 100%;
}
</style>
