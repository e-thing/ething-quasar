<template>
  <div class="resource-editor">

    <div v-if="$slots.default">
      <slot></slot>
    </div>

    <div v-if="!!meta.description">
      <q-markdown>{{ meta.description.trim() }}</q-markdown>
    </div>

    <div>
      <form-schema :schema="schema" v-model="model" @error="inputError = $event"/>
    </div>

    <q-inner-loading class="text-center" :showing="!ready">
      <div class="q-pa-lg text-primary">loading...</div>
      <q-spinner-oval color="primary" size="50px" />
    </q-inner-loading>

  </div>
</template>

<script>
import EThing from 'ething-js'
import { extend } from 'quasar'
const csv = require('csvtojson')

export default {
    name: 'ResourceEditor',

    props: ['resource'], // either a resource or a string describing a type

    data () {

        var parse = this.getSchemaModel(() => {
          this.$nextTick(() => {
            this.ready = true
          })
        })

        return {
            inputError: false,
            create: !(this.resource instanceof EThing.Resource),
            type: this.resource instanceof EThing.Resource ? this.resource.type() : this.resource,
            schema: parse.schema,
            model: parse.model,
            meta: parse.meta,
            ready: false
        }
    },

    watch: {
      inputError(err) {
        this.$emit('error', err)
      }
    },

    methods: {
        submit () {
          if (this.inputError) {
            return Promise.reject('form error')
          }

          var res = null

          if (this.create) {
            res = EThing.Resource.create(Object.assign({type: this.type}, this.model)).then(r => {
              this.meta.created(r)
              return r
            })
          } else {
            res = this.resource.set(Object.assign({}, this.model))
          }

          return res
        },

        getSchemaModel (onReady) {
          var type = this.resource instanceof EThing.Resource ? this.resource.type() : this.resource
          var resource = this.resource instanceof EThing.Resource ? this.resource : null

          var meta = resource ? this.$ethingUI.get(resource) : this.$ethingUI.get(type)

          meta = this.customize(extend(true, {}, meta), resource, type)

          var required = meta.required || []
          var properties = {}
          var model = {}
          var nPromise = 0
          var post = () => {
            nPromise--
            if (nPromise<=0) {
              if (typeof onReady === 'function')
                onReady()
            }
          }
          for(let k in meta.properties) {
            let isRequired = meta.properties[k]['$required'] || required.indexOf(k)!==-1

            if (!meta.properties[k]['$readOnly'] || isRequired) {
                properties[k] = meta.properties[k]
                if (meta.properties[k]['$required'] && required.indexOf(k)===-1) {
                    required.push(k)
                }

                if (resource) {
                    let maybePromise = meta.properties[k].get(resource)

                    if (maybePromise instanceof Promise) {
                      nPromise++
                      maybePromise.then((val) => {
                        this.$set(this.model, k, val)
                      }).finally(post)
                    } else {
                      model[k] = maybePromise
                    }
                }
            }
          }

          var propertiesKeys = Object.keys(properties)
          required = required.filter(k => propertiesKeys.indexOf(k) !== -1)

          if (!nPromise) {
            post()
          }

          return {
              model,
              schema: {
                  type: 'object',
                  required,
                  properties,
                  '$order': [
                    'name'
                  ]
              },
              meta
          }
        },

        customize (schema, resource, type) {
          if (!resource) {
            // only when creating a new resource
            if (type === 'resources/File') {

              schema.properties.content = {
                id: 'resource.content',
                type: 'string',
                '$component': 'file'
              }

              schema.properties.name['$dependencies'] = {
                'resource.content': function (_, self, node) {
                  if (node.files.length > 0) {
                    self.c_value = node.files[0].name
                  }
                }
              }
            }
            else if (type === 'resources/Table') {

              schema.properties.content = {
                id: 'resource.content',
                type: 'string',
                '$component': 'file',
                accept: '.json,.csv',
                '$converter': function (file, data, done, error) {

                  const _done = (d) => {
                    if (!Array.isArray(d))
                      return error('invalid file content')

                    for (var i in d) {
                      if (typeof d[i] !== 'object' || d[i] === null)
                        return error('invalid file content')
                      if (!d[i].date) {
                        return error('no date field for the item ' + i)
                      }
                      var hasData = false
                      for (var k in d[i]) {
                        if (k != 'date' && k != 'id') {
                          hasData = true
                          break
                        }
                      }
                      if (!hasData) {
                        return error('no data for the item ' + i)
                      }
                    }

                    done(d)
                  }

                  if (/\.json$/i.test(file.name)) {
                    _done(JSON.parse(data))
                  } else if(/\.csv$/i.test(file.name)) {
                    csv().fromString(data).then((jsonObj) => {
                      _done(jsonObj)
                    })
                  } else {
                    error('invalid file type')
                  }
                }
              }

              schema.properties.name['$dependencies'] = {
                'resource.content': function (_, self, node) {
                  if (node.files.length > 0) {
                    self.c_value = node.files[0].name
                  }
                }
              }
            }
          }
          return schema
        }
    }


}
</script>

<style lang="stylus" scoped>

.resource-editor > div:not(:last-child) {
  padding-bottom: $space-y-base
}

</style>
