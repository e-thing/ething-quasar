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

    no-content-padding

    size="lg"

  >
    <q-card flat>

      <q-card-section v-if="items.length==0">
        <q-banner
            class="bg-warning text-white"
        >
          <q-icon left name="mdi-alert"/> Oops. No resource can be created !
        </q-banner>
      </q-card-section>

      <q-card-section>
        <q-select
         v-if="items.length>1"
         v-model="selectedType"
         :options="items"
         emit-value
        >
          <template v-slot:selected>
            <div v-if="selectedType">
              <q-avatar :icon="selectedClass.icon" :color="selectedClass.color" text-color="white" size="24px" class="q-mr-sm"/>
              <span>{{ selectedClass.title }}</span>
            </div>
            <div v-else>select a type</div>
          </template>

          <template v-slot:option="scope">
            <q-item
              v-bind="scope.itemProps"
              v-on="scope.itemEvents"
            >
              <q-item-section avatar>
                <q-avatar :color="scope.opt.color" text-color="white" :icon="scope.opt.icon" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ scope.opt.label }}</q-item-label>
                <q-item-label caption>{{ scope.opt.sublabel }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </q-card-section>

      <q-card-section>
        <resource-editor v-if="selectedType" ref="form" :resource="selectedType" :key="selectedType" @error="formError=$event"/>
      </q-card-section>

      <q-card-section v-if="error">
        <q-banner
            class="bg-negative text-white"
        >
          <q-icon left name="mdi-alert"/> {{ String(error) }}
        </q-banner>
      </q-card-section>
    </q-card>
  </modal>
</template>

<script>

import ResourceEditor from './ResourceEditor'
import Modal from './Modal'

export default {
    name: 'ResourceCreateModal',

    components: {
      Modal,
      ResourceEditor
    },

    props: {
      value: Boolean,
      types: Array
    },

    data () {
        return {
          selectedType: undefined,
          loading: false,
          error: false,
          formError: false
        }
    },

    computed: {

      items () {
        var r = []
        var types = this.types || []
        if (types.length == 0) types = ['resources/Resource']

        this.$ethingUI.iterate('resources', (resourceClsName) => {
          var resourceCls = this.$ethingUI.get(resourceClsName)
          if (!resourceCls.virtual && !resourceCls.disableCreation) {
            var append = false
            if (types.indexOf(resourceClsName) !== -1) {
              append = true
            } else {
              for (var i in types) {
                if (this.$ethingUI.isSubclass(resourceCls, types[i])) {
                  append = true
                  break
                }
              }
            }

            if (append) {
              r.push(resourceCls)
            }
          }
        })

        return r.map(m => {
          var t = m._type

          var cat = t.split('/')
          cat.pop()
          cat = cat.join(' ')

          return {
            label: m.title,
            icon: m.icon,
            color: m.color,
            sublabel: cat,
            value: t
          }
        })
      },

      title () {
        if (this.items.length==1) return 'create '+this.items[0].label
        return 'create'
      },

      selectedClass () {
        return this.selectedType ? this.$ethingUI.get(this.selectedType) : undefined
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
