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
    <template v-slot:buttons-right>
      <q-btn v-if="!__singleEntry && selectedType" color="grey" flat icon="mdi-arrow-left" label="back" @click="selectedType=null"/>
    </template>
    <q-card flat>

      <q-card-section v-if="!selectedType">
        <q-banner
            v-if="__createSelectOptions.length==0"
            class="bg-warning text-white"
        >
          <q-icon left name="mdi-alert"/> Oops. No resource can be created !
        </q-banner>
        <q-list v-else>
          <template v-for="cat in __createSelectOptions">
            <q-item-label header v-if="__createSelectOptions.length>1">{{ cat.name }}</q-item-label>
            <q-item
              v-for="(item, index) in cat.items"
              :key="cat.name + index"
              clickable
              @click="item.click()"
              :inset-level="item.icon ? 0 : 1"
            >
              <q-item-section avatar v-if="item.icon">
                <q-icon :name="item.icon" :color="item.color"/>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ item.label }}</q-item-label>
                <q-item-label v-if="item.description" caption lines="2">{{ item.description }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-list>
      </q-card-section>

      <template v-else>
        <q-card-section>
          <resource-editor ref="form" :resource="selectedType" :key="selectedType" @error="formError=$event"/>
        </q-card-section>

        <q-card-section v-if="error">
          <q-banner
              class="bg-negative text-white"
          >
            <q-icon left name="mdi-alert"/> {{ String(error) }}
          </q-banner>
        </q-card-section>
      </template>
    </q-card>
  </modal>
</template>

<script>

export default {
    name: 'ResourceCreateModal',

    props: {
      value: Boolean,

      /*
      [
        'resources/device',
        { // for custom entry
          icon: 'quasar icon',
          label: '...', // mandatory
          color: 'quasar color',
          description: '',
          click () { // mandatory

          }
        }
      ]
      */
      types: Array,
      open: Boolean,
      title: {
        type: String,
        default: 'Create'
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

      __createTypes () {
        if (typeof this.types !== 'undefined') {
          if (typeof this.types === 'string') {
            return this.types.split(' ').filter(t => !!t)
          } else {
            return this.types
          }
        } else {
          return ['resources/Resource']
        }
      },

      __createSelectOptions () {

        var baseCls = (this.__createTypes || []).filter(t => typeof t === 'string')
        var extra = (this.__createTypes || []).filter(t => typeof t === 'object' && t !== null)
        var clsList = this.$ethingUI.getSubclass(baseCls).filter(cls => !cls.virtual && !cls.disableCreation)
        var defaultCategory = 'other'

        // order by categories
        var categories = {}

        clsList.forEach(cls => {
          var path = (cls.category || defaultCategory).split('.')
          var label = cls.title || cls.split('/').pop()
          var category = path[0]

          if (!categories[category]) {
            categories[category] = {
              items: []
            }
          }

          categories[category].items.push({
            label,
            color: cls.color,
            icon: cls.icon,
            description: cls.description,
            click: () => {
              if (this.open) {
                this.$router.push({
                  name: 'create',
                  params: {
                    type: cls._type
                  }
                })
              } else {
                this.selectedType = cls._type
              }
            }
          })
        })

        extra.forEach(obj => {
          if (typeof obj !== 'object' || obj===null || !obj.label || !obj.click) return
          var category = obj.category || defaultCategory
          if (!categories[category]) {
            categories[category] = {
              items: []
            }
          }
          categories[category].items.push(Object.assign({
            color: 'grey',
          }, obj))
        })

        var other = categories[defaultCategory]
        var orderedCategories = []

        delete categories[defaultCategory]

        for(var category in categories){
          orderedCategories.push(Object.assign({
            name: category
          }, categories[category]))
        }

        if (other) {
          orderedCategories.push(Object.assign({
            name: defaultCategory
          }, other))
        }

        return orderedCategories
      },

      __singleEntry () {
        return this.__createSelectOptions.length===1 && this.__createSelectOptions[0].items.length === 1 ? this.__createSelectOptions[0].items[0] : null
      },

    },

    watch: {
      value: {
        handler (val) {
          if (val) {
            var singleEntry = this.__singleEntry
            if (singleEntry) {
              singleEntry.click()
            }
          }
        },
        immediate: true
      },
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
