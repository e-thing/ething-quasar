<template>
  <form-schema-layout class="form-schema-file">

    <div>
      <span class="q-mr-md relative-position overflow-hidden">
        <q-icon name="add" color="primary"/> add file
        <input ref="file" type="file" class="file-input absolute-full cursor-pointer" @change="__add" :accept="c_schema.accept">
      </span>

      <small v-for="(file, index) in files" :key="index" class="text-faded">
        {{ file.name }} ({{ file.__size }})
      </small>
    </div>

  </form-schema-layout>
</template>

<script>

import { FormComponent } from '../core'
import { format } from 'quasar'
const { humanStorageSize } = format

/*
options
$converter: f(file, data, done, error) // handler to convert/check the content of the file
*/

export default {
  name: 'FormSchemaFile',

  mixins: [FormComponent],

  data () {
    return {
      files: []
    }
  },

  methods: {
    __add (e, files) {
      files = Array.prototype.slice.call(files || e.target.files)
      this.$refs.file.value = ''

      let filesReady = [] // List of image load promises
      files = files
        .map(file => {
          file.__size = humanStorageSize(file.size)
          file.__timestamp = new Date().getTime()
          file.__converting = true

          this.convert(file, (content) => {
            this.$nextTick(() => {
              file.__converting = false
              this.c_value = content
            })
          }, (msg) => {
            this.files = []
            this.$emit('error', String(msg))
            this.c_value = undefined
          })

          return file
        })

      this.files = files
    },

    convert (file, done, error) {

      const _done = (content) => {
        var converter = this.c_schema['$converter']
        if (typeof converter === 'function') {
          try {
            converter.call(this, file, content, done, error)
          } catch (e) {
            error(e)
          }
        } else {
          done(content)
        }
      }

      if (this.c_schema.format === 'data-url') {
        let fileReader = new FileReader()
        fileReader.onloadend = (e) => {
          _done(fileReader.result)
        }
        fileReader.readAsDataURL(file)
      } else if (this.c_schema.format === 'base64') {
        let fileReader = new FileReader()
        fileReader.onloadend = (e) => {
          const content = fileReader.result
          const parts = content.split(',', 2)
          _done(parts[1])
        }
        fileReader.readAsDataURL(file)
      } else if (this.c_schema.format === 'text') {
        let fileReader = new FileReader()
        fileReader.onloadend = (e) => {
          _done(fileReader.result)
        }
        fileReader.readAsText(file)
      } else {
        _done(file)
      }
    }
  },

  rule (schema) {
    return schema.type === 'string' && ['data-url', 'base64'].indexOf(schema.format) !== -1
  }

}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.file-input {
  opacity: 0;
  max-width: 100%;
  height: 100%;
  width: 100%;
  font-size: 0;
}
</style>
