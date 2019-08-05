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
     emit-value

    >
      <template v-slot:selected>
        <div v-if="selectedType">
          <q-avatar :icon="selectedClass.icon" :color="selectedClass.color" text-color="white" size="24px" class="q-mr-sm"/>
          <span>{{ selectedClass.title }}</span>
        </div>
        <div v-else>select a resource</div>
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

    <resource-editor v-if="selectedType" ref="form" :resource="selectedType" :key="selectedType" @error="formError=$event"/>

    <q-banner
        v-if="error"
        class="bg-red text-white q-mb-xl"
    >
      <q-icon left name="mdi-alert"/> {{ String(error) }}
    </q-banner>

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
      types: {
        type: Array,
        default () {
          return ['resources/Resource']
        }
      }
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

        this.$ethingUI.iterate('resources', (resourceClsName) => {
          var resourceCls = this.$ethingUI.get(resourceClsName)
          if (!resourceCls.virtual && !resourceCls.disableCreation) {
            var append = false
            if (this.types.indexOf(resourceClsName) !== -1) {
              append = true
            } else {
              for (var i in this.types) {
                if (this.$ethingUI.isSubclass(resourceCls, this.types[i])) {
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
