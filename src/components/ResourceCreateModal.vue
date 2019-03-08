<template>
  <modal
    ref="modal"
    :value="value"
    @input="$emit('input', $event)"
    :title="title"
    icon="add"

    :valid-btn-disable="formError"
    valid-btn-label="create"
    :valid-btn-loading="loading"
    @valid="handler"

    @cancel="onCancel"

  >

    <q-select
     v-if="items.length>1"
     v-model="selectedType"
     :options="items"
     class="q-mb-xl"
    />

    <resource-editor v-if="selectedType" ref="form" :resource="selectedType" :key="selectedType" @error="formError=$event"/>

    <q-alert
        v-if="error"
        type="negative"
        class="q-mb-xl"
    >
      {{ String(error) }}
    </q-alert>

  </modal>
</template>

<script>

import ResourceEditor from './ResourceEditor'

export default {
    name: 'ResourceCreateModal',

    components: {
      ResourceEditor
    },

    props: {
      value: Boolean,
      types: Array,
    },

    data () {
        return {
          selectedType: this.types[0],
          loading: false,
          error: false,
          formError: false
        }
    },

    computed: {

      items () {
        var r = []

        this.types.forEach(t => {
          var m = this.$ethingUI.get(t)

          if (m.virtual) {
            // find all subclass
            this.$ethingUI.iterate('resources', (resourceClsName) => {
              if (this.$ethingUI.isSubclass(resourceClsName, t)) {
                r.push(resourceClsName)
              }
            })
          } else {
            r.push(t)
          }
        })

        r = r.filter((v, i, a) => a.indexOf(v) === i);

        return r.map(t => {
          var m = this.$ethingUI.get(t)

          var cat = t.split('/')
          cat.pop()
          cat = cat.join(' ')

          return {
            label: m.title,
            icon: m.icon,
            leftColor: m.color,
            sublabel: cat,
            value: t
          }
        })
      },

      title () {
        if (this.items.length==1) return 'create '+this.items[0].label
        return 'create'
      }

    },

    methods: {
      show () {
        return this.$refs.modal.show()
      },
      hide () {
        return this.$refs.modal ? this.$refs.modal.hide() : Promise.resolve()
      },

      onDone (resource) {
        this.hide()
        this.$emit('ok')
      },

      onCancel () {
        this.hide()
        this.$emit('cancel')
      },

      handler () {
        this.loading = true
        this.$refs.form.submit().then(this.onDone).catch(reason => {
          this.error = reason || 'error'
        }).finally(() => {
          this.loading = false
        })
      }
    }

}
</script>
