<template>
  <div>
    <slot></slot>

    <div v-if="meta.description">
        {{ meta.description }}
    </div>

    <form-schema :schema="schema" v-model="model" @error="inputError = $event" class="q-mb-xl"/>

    <q-alert
        v-if="error"
        type="negative"
        class="q-mb-xl"
    >
      {{ String(error) }}
    </q-alert>

    <div>
        <q-btn :loading="loading" :disable="inputError" color="primary" icon="done" :label="create ? 'create' : 'edit'" @click="handler"/>
        <q-btn color="negative" icon="clear" label="cancel" flat @click="$emit('canceled')"/>
    </div>

    <q-inner-loading class="text-center" :visible="!ready">
      <div class="q-pa-lg text-primary">loading...</div>
      <q-spinner-oval color="primary" size="50px" />
    </q-inner-loading>

  </div>
</template>

<script>
import EThing from 'ething-js'

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
            loading: false,
            error: null,
            ready: false
        }
    },

    methods: {
        handler () {
          this.loading = true
          var def = {}
          var res = null

          if (this.create) {
            if (typeof EThing[this.type] !== 'undefined') {
              res = EThing[this.type].create(Object.assign(def, this.model))
            } else {
              res = EThing.Device.create(this.type, Object.assign(def, this.model))
            }
          } else {
            res = this.resource.set(Object.assign(def, this.model))
          }

          res.then((r) => {
              this.$emit('done', r)
          }).catch((err) => {
              this.error = err
          }).finally(() => {
              this.loading = false
          })
        },

        getSchemaModel (onReady) {
          var type = this.resource instanceof EThing.Resource ? this.resource.type() : this.resource
          var resource = this.resource instanceof EThing.Resource ? this.resource : null

          var meta = resource ? EThing.meta.get(resource) : EThing.meta.get(type)

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
            let isRequired = meta.properties[k].required || required.indexOf(k)!==-1
            
            if (!meta.properties[k].readOnly || isRequired) {
                properties[k] = meta.properties[k]
                if (meta.properties[k].required && required.indexOf(k)===-1) {
                    required.push(k)
                }

                if (resource) {
                    let maybePromise
                    if(typeof meta.properties[k].get === 'function')
                      maybePromise = meta.properties[k].get(resource)
                    else
                      maybePromise = resource.attr(k)

                    if (maybePromise instanceof Promise) {
                      nPromise++
                      maybePromise.then((val) => {
                        model[k] = val
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
                  properties
              },
              meta
          }
        }
    }


}
</script>
