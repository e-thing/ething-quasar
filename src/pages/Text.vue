<template>
  <q-page>

    <q-btn-group flat >
      <q-btn :loading="saveLoading" label="save" icon="mdi-content-save-outline" @click="save"/>
      <q-btn-dropdown :label="langage">
        <q-list link>
          <q-item v-for="(value, key, index) in langages" :key="key" v-close-overlay @click.native="setLangage(key)">
            <q-item-main>
              <q-item-tile label>{{ key }}</q-item-tile>
            </q-item-main>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </q-btn-group>
    <span class="title text-faded" :class="{dirty: dirty}">{{ resource.name() }}</span>

    <codemirror ref='cm' v-model="content" :options="cmOption" @changes="onChange"></codemirror>

  </q-page>
</template>

<script>

import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/mode/yaml/yaml.js'
import 'codemirror/mode/python/python.js'

import 'codemirror/addon/edit/matchbrackets.js'
import 'codemirror/addon/comment/continuecomment.js'
import 'codemirror/addon/comment/comment.js'

export default {
  name: 'PageText',

  components: {
    codemirror
  },

  data () {
    return {
      content: '',
      cmOption: {
        mode: 'text/plain',
        tabSize: 4,
        styleActiveLine: true,
        lineNumbers: true,
        lineWrapping: false,
        foldGutter: true,
        styleSelectedText: true,
        mode: 'text/plain',
        matchBrackets: true,
        showCursorWhenSelecting: true,
        extraKeys: {
          "Ctrl": "autocomplete",
          "Ctrl-S": () => {
            this.save()
          }
        },
        hintOptions:{
          completeSingle: false
        },
        viewportMargin: Infinity
      },
      loading: true,
      saveLoading: false,
      langages: {
        'text': 'text/plain',
        'javascript': ['text/javascript', 'application/javascript'],
        'yaml': ['text/x-yaml', 'application/x-yaml'],
        'json': 'application/json',
        'python': 'text/x-python'
      },
      langage: 'text',
      dirty: false
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
    },

  },

  methods: {

    codemirror () {
      return this.$refs['cm'].codemirror
    },

    markClean () {
      this.dirty = false
      this.codemirror().markClean()
    },

    reloadContent () {
      this.loading = true
      this.resource.read().done( (data) => {
        this.setLangage(this.resource.mime())
        this.content = data
        this.$nextTick(() => {
          this.markClean()
          this.codemirror().clearHistory()
        })
      }).always( () => {
        this.loading = false
      })
    },

    setLangage (langage) {
      console.log('setLangage = ' + langage)
      if (/^[^\/]+\/[^\/]+$/.test(langage)) {
        // mime
        for(var l in this.langages) {
          if (Array.isArray(this.langages[l]) ? this.langages[l].indexOf(langage) !== -1 : this.langages[l] === langage) {
            this.cmOption.mode = Array.isArray(this.langages[l]) ? this.langages[l][0] : langage
            this.langage = l
            return
          }
        }
      }

      if(!this.langages[langage])
        langage = 'text'

      this.cmOption.mode = this.langages[langage]
      this.langage = langage
    },

    save () {
      this.saveLoading = true
      this.resource.write(this.content).done(() => {
        this.dirty = false
        this.markClean()
      }).always( () => {
        this.saveLoading = false
      })
    },

    onChange (cm, changes) {
      this.dirty = !cm.isClean()
    }
  },

  mounted () {
    // once mounted, we need to trigger the initial server data fetch
    this.reloadContent()
  }

}
</script>

<style lang="stylus">
@import '~variables'

.CodeMirror
  height 100%

.title.dirty:after
  content '*'
  color $negative

</style>
