<template>
  <div>
    <slot></slot>

    <div v-if="meta.description">
        {{ meta.description }}
    </div>

    <form-schema :schema="schema" :model.sync="model" class="q-mb-xl"/>

    <q-alert
        v-if="error"
        type="negative"
        class="q-mb-xl"
    >
      {{ String(error) }}
    </q-alert>

    <div>
        <q-btn :loading="loading" color="primary" icon="done" :label="create ? 'create' : 'edit'" @click="handler"/>
        <q-btn color="negative" icon="clear" label="cancel" flat />
    </div>
  </div>
</template>

<script>
import EThing from 'ething-js'

export default {
    name: 'ResourceEditor',

    props: ['resource'], // either a resource or a string describing a type

    data () {

        var parse = this.getSchemaModel()

        return {
            create: !(this.resource instanceof EThing.Resource),
            type: this.resource instanceof EThing.Resource ? this.resource.type() : this.resource,
            schema: parse.schema,
            model: parse.model,
            meta: parse.meta,
            loading: false,
            error: null
        }
    },

    methods: {
        handler () {
          this.loading = true
          var ns = null
          var def = {}
          var res = null

          if (this.create) {
            if (typeof EThing[this.type] !== 'undefined') {
              ns = EThing[this.type]
            } else {
              ns = EThing.Device
              def.type = this.type
            }

            res = ns.create(Object.assign(def, this.model))
          } else {
            res = this.resource.set(Object.assign(def, this.model))
          }

          res.done((r) => {
              this.$emit('done', r)
          }).fail((err) => {
              this.error = err
          }).always(() => {
              this.loading = false
          })
        },

        getSchemaModel () {
          var type = this.resource instanceof EThing.Resource ? this.resource.type() : this.resource
          var resource = this.resource instanceof EThing.Resource ? this.resource : null

          var meta = resource ? EThing.meta.get(resource) : EThing.meta.get(type)

          var required = meta.required || []
          var properties = {}
          var model = {}
          for(let k in meta.properties) {
            if (!meta.properties[k].readOnly) {
                properties[k] = meta.properties[k]
                if (meta.properties[k].required && required.indexOf(k)===-1) {
                    required.push(k)
                }

                if (resource) {
                    if(typeof meta.properties[k].get === 'function')
                      model[k] = meta.properties[k].get(resource)
                    else
                      model[k] = resource.attr(k)
                }
            }
          }

          return {
              model,
              schema: {
                  type: 'object',
                  required,
                  properties
              },
              meta
          }
        }
    }


}
</script>
