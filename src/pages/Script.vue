<template>
  <q-page>
    <multipane class="absolute fit" :class="orientation == 'vertical' ? 'vertical-panes' : 'horizontal-panes'" :layout="orientation">
      <div class="pane" :style="orientation == 'vertical' ? { width: '50%', maxWidth: '75%' } : { height: '50%', maxHeight: '75%' }">
        <q-btn-group flat >
          <q-btn :loading="saveLoading" label="save" icon="mdi-content-save-outline" @click="save"/>
          <q-btn :loading="exeLoading" label="run" icon="play_arrow" @click="onExecuteClick"/>
        </q-btn-group>
        <span class="title text-faded" :class="{dirty: dirty}">{{ resource.name() }}</span>

        <codemirror ref='cm' v-model="content" :options="cmOption" @changes="onChange"></codemirror>
      </div>
      <multipane-resizer></multipane-resizer>
      <div class="pane console" :style="{ flexGrow: 1 }">
        <div v-if="exeLoading" class="absolute-center text-faded">
          running ...
        </div>
        <div v-else class="absolute fit">
          <div class="output">
            <div v-for="(item, key) in console.output" :key="key" class="output-line" :class="item.type">
              <pre class="q-ma-none"><code>{{ item.chunk }}</code></pre>
            </div>
          </div>
        </div>
      </div>
    </multipane>
  </q-page>
</template>

<script>

import { Multipane, MultipaneResizer } from 'vue-multipane';

import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript.js'

import 'codemirror/addon/edit/matchbrackets.js'
import 'codemirror/addon/edit/closebrackets.js'
import 'codemirror/addon/comment/continuecomment.js'
import 'codemirror/addon/comment/comment.js'

export default {
  name: 'PageText',

  components: {
    codemirror,
    Multipane,
    MultipaneResizer
  },

  data () {
    return {
      content: '',
      cmOption: {
        mode: 'application/javascript',
        tabSize: 4,
        styleActiveLine: true,
        lineNumbers: true,
        lineWrapping: false,
        foldGutter: true,
        styleSelectedText: true,
        matchBrackets: true,
        autoCloseBrackets: true,
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
      exeLoading: false,
      dirty: false,
      console: {
        output: []
      },
      orientation: this.$q.platform.is.mobile ? 'horizontal' : 'vertical',
    }
  },

  computed: {
    resource () {
      var id = this.$route.params.id
      var r = this.$store.getters['ething/get'](id)
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
      this.resource.read().then( (data) => {
        this.content = data
        this.$nextTick(() => {
          this.markClean()
          this.codemirror().clearHistory()
        })
      }).finally( () => {
        this.loading = false
      })
    },

    save (done) {
      this.saveLoading = true
      this.resource.write(this.content).then(() => {
        this.dirty = false
        this.markClean()

        if(typeof done === 'function')
          done()
      }).finally( () => {
        this.saveLoading = false
      })
    },

    onChange (cm, changes) {
      this.dirty = !cm.isClean()
    },

    execute () {
      this.exeLoading = true
      this.resource.execute().then(result => {
        console.log(result)
        this.printResult(result)
      }).finally(() => {
        this.exeLoading = false
      })
    },

    onExecuteClick () {
      this.dirty ? this.save(this.execute) : this.execute()
    },

    printResult (result) {
      this.console.output = result.output


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

.vertical-panes > .pane {
  overflow: auto;
}

.vertical-panes > .pane ~ .pane {
  border-left: 1px solid #ccc;
}

.horizontal-panes > .pane ~ .pane {
  border-top: 1px solid #ccc;
}

.horizontal-panes > .pane {
  overflow: auto;
}

.custom-resizer > .pane ~ .pane {
}
.custom-resizer > .multipane-resizer {
  background-color: #f1f1f1;
  margin: 0; left: 0;
  position: relative;
  &:before {
    display: block;
    content: "";
    width: 3px;
    height: 40px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -20px;
    margin-left: -1.5px;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
  }
  &:hover {
    &:before {
      border-color: #999;
    }
  }
}


.console
  .output-line
    padding-left: $space-x-base
    padding-right: $space-x-base

    &.stdout
      color: $faded
    &.stderr
      color: $negative
    &:not(:last-child)
      border-bottom 1px solid $grey-3

.CodeMirror
  height 100%

.title.dirty:after
  content '*'
  color $negative

</style>
