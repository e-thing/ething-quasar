<template>
  <div class="form-schema-json">
    <!--<input type="text" v-bind:value="model" v-on:input="value = $event.target.value"/>-->
    <small class="form-schema-description text-faded">{{ schema.description }}</small>
    <codemirror ref='cm' v-bind:value="formattedModel" :options="cmOption" v-on:input="parseJson"></codemirror>

  </div>
</template>

<script>

import { FormComponent } from './core'

import { codemirror, CodeMirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript.js'

import 'codemirror/addon/edit/matchbrackets.js'
import 'codemirror/addon/edit/closebrackets.js'

import 'codemirror/addon/fold/foldcode.js'
import 'codemirror/addon/fold/foldgutter.js'
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/brace-fold.js'

import 'codemirror/addon/lint/lint.js'
import 'codemirror/addon/lint/lint.css'

import jsonlint from 'jsonlint-mod'

CodeMirror.registerHelper("lint", "json", function(text) {
  var found = [];
  var _jsonlint = jsonlint.parser;
  _jsonlint.parseError = function(str, hash) {
    var loc = hash.loc;
    found.push({from: CodeMirror.Pos(loc.first_line - 1, loc.first_column),
                to: CodeMirror.Pos(loc.last_line - 1, loc.last_column),
                message: str});
  };
  try { _jsonlint.parse(text); }
  catch(e) {}
  return found;
});

export default {
  name: 'FormSchemaJson',

  mixins: [FormComponent],

  components: {
    codemirror
  },

  computed: {

    formattedModel () {
      return this.schema.type === 'string' ? this.castedModel : JSON.stringify(this.castedModel, null, 4)
    }
  },

  data () {
    return {
      cmOption: {
        mode: 'application/json',
        tabSize: 4,
        styleActiveLine: true,
        lineNumbers: true,
        lineWrapping: false,
        foldGutter: true,
        styleSelectedText: true,
        lint: true,
				gutters: ["CodeMirror-lint-markers", "CodeMirror-linenumbers", "CodeMirror-foldgutter"],
				matchBrackets: true,
				autoCloseBrackets: true,
				foldGutter: true,
        showCursorWhenSelecting: true,
        extraKeys: {
          "Ctrl": "autocomplete",
        },
        hintOptions:{
          completeSingle: false
        },
        viewportMargin: Infinity
      },
    }
  },

  methods: {
    parseJson (val) {

      if (this.schema.type !== 'string') {
        try {
          val = JSON.parse(val)
        } catch (e) {
          val = null
        }
      }

      this.setValue(val)
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
