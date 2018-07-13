<template>
  <q-page>

    <q-table
      :data="serverData"
      :columns="columns"
      row-key="id"
      :visible-columns="visibleColumns"
      :loading="loading"
      :pagination.sync="serverPagination"
      @request="request"
      :selection="edit ? 'multiple' : 'none'"
      :selected.sync="selected"
      color="secondary"
      class="absolute fit scroll"
    >

      <template slot="top-left" slot-scope="props">
        <div class="q-title q-title-opacity">{{ resource.basename() }} <small v-if="createdBy" class="cursor-pointer text-faded" @click="$ui.open(createdBy)"> - {{ createdBy.basename() }}</small></div>
      </template>

      <template slot="top-right" slot-scope="props">

        <q-table-columns
          color="secondary"
          class="q-mr-sm"
          v-model="visibleColumns"
          :columns="columns"
        />
        <q-btn
          flat round dense
          icon="mdi-chart-line"
          color="faded"
          @click="$ui.open(resource, 'chart')"
          :disable="isEmpty"
        />
        <q-btn
          flat round dense
          icon="mdi-information-outline"
          color="faded"
          @click="showStats"
          :disable="isEmpty"
        />
        <q-btn
          flat round dense
          icon="add"
          color="faded"
          @click="showAddRow"
        />
        <q-btn
          flat round dense
          icon="check_box"
          :color="edit ? 'secondary' : 'faded'"
          @click="edit = !edit"
          :disable="isEmpty"
        />
        <q-btn
          flat round dense
          v-if="selected.length"
          color="negative"
          icon="delete"
          @click="removeSelection"
        />
        <q-btn
          flat round dense
          :color="props.inFullscreen ? 'secondary' : 'faded'"
          :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
          @click="props.toggleFullscreen"
        />
      </template>
    </q-table>

    <modal v-model="modalStatistics" title="Statistics" icon="mdi-information-outline" valid-btn-hide cancel-btn-label="Close" cancel-btn-color="faded">

      <span slot="buttons">
        <q-btn
          color="faded"
          :disable="loadingStatistics"
          @click="computeStats"
          label="Reload"
          flat
        />
      </span>

      <div v-if="loadingStatistics" class="text-center q-mb-md">
        <div class="q-pa-lg text-primary">loading...</div>
        <q-spinner-oval color="primary" size="50px" />
      </div>

      <div v-else-if="statistics !== null">
        <div v-for="key in resource.keys()">

          <div class="q-mb-md q-mt-lg q-title q-title-opacity"><q-icon name="mdi-menu-right" /> column: {{ key }}</div>

          <div class="row q-mb-md q-ml-lg">
            <div v-if="statistics[key]">
              <template v-for="(value, key) in statistics[key]">
                <div class="col-xs-12 col-sm-4 key text-secondary">{{ key }}</div>
                <div class="col-xs-12 col-sm-8 value">{{ format(key, value) }}</div>
              </template>
            </div>
            <div v-else class="text-faded">No data</div>
          </div>

        </div>

      </div>

    </modal>

    <modal v-model="add.modal" title="Insert data" icon="add" valid-btn-label="Add" :valid-btn-disable="add.error" :valid-btn-loading="add.loading" @valid="addRow">

      <span slot="buttons">
        <q-btn
          color="primary"
          @click="addRowTmpl"
          icon="add"
          label="add another column"
          flat
          size="md"
          class="float-right"
        />
      </span>

      <div>
        <div v-for="(item, index) in add.data" :key="index" class="q-my-lg add-row-item">

          <q-field
            class="q-my-md"
            :error="$v.add.data.$each[index].key.$error"
            error-label="required"
          >
            <q-input
              v-model.trim="item.key"
              stack-label="Column name"
              @focus="addRowShowKeySuggestion(index)"
              @blur="$v.add.data.$each[index].key.$touch"
            >
              <q-autocomplete
                ref="addRowKeyAutocomplete"
                :min-characters="0"
                @selected="selected"
                :filter="addRowKeyFilter"
                :static-data="{field: 'value', list: addRowListKeys()}"
              />
            </q-input>
          </q-field>

          <q-field
            class="q-my-md"
            icon="keyboard_arrow_right"
            label="Type"
          >
            <q-select
              v-model="item.type"
              :options="add.typeOptions"
            />
          </q-field>

          <q-field
            class="q-my-md"
            icon="keyboard_arrow_right"
            label="Value"
            :error="$v.add.data.$each[index].value.$error"
            error-label="required"
          >
            <q-input
              v-if="item.type==='string'"
              v-model="item.value"
              @blur="$v.add.data.$each[index].value.$touch"
            />
            <q-input
              v-else-if="item.type==='number'"
              v-model="item.value"
              type="number"
              @blur="$v.add.data.$each[index].value.$touch"
            />
            <q-select
              v-else-if="item.type==='boolean'"
              v-model="item.value"
              :options="[{label: 'True', value: true}, {label: 'False', value: false}]"
              @blur="$v.add.data.$each[index].value.$touch"
            />
          </q-field>

        </div>
      </div>

      <q-alert
          v-if="add.error"
          type="negative"
          class="q-my-md"
      >
        {{ String(add.error) }}
      </q-alert>

    </modal>

  </q-page>
</template>

<script>

import { date as qdate } from 'quasar'
import { required } from 'vuelidate/lib/validators'


export default {
  name: 'PageTable',

  data () {
    return {
      loading: true,
      serverPagination: {
        rowsPerPage: 10,
        page: 1,
        sortBy: 'date',
        descending: true,
        rowsNumber: 0 // specifying this determines pagination is server-side
      },
      serverData: [],
      filter: '',
      visibleColumns: ['date'],
      edit: false,
      selected: [],
      loadingStatistics: false,
      statistics: null,
      modalStatistics: false,
      add: {
        modal: false,
        error: false,
        data: [],
        typeOptions: ['string', 'number', 'boolean'].map(t => {
          return {
            label: t,
            value: t
          }
        })
      }
    }
  },

  validations () {
    return {
      add: {
        data: {
          $each: {
            key: {
              required
            },
            value: {
              required
            }
          }
        }
      }
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

      this.serverPagination.rowsNumber = r.length()
      this.visibleColumns = ['date'].concat(r.keys())

      return r
    },

    columns () {
      var resource = this.resource
      var columns = []
      var defaultAttr = {
        align: 'left'
      }

      if (resource) {
        columns = resource.keys().map( key => {
          return Object.assign({}, defaultAttr, {
            name: key,
            label: key,
            field: key
          })
        })
      }

      columns.unshift(Object.assign({}, defaultAttr, {
        name: 'date',
        label: 'date',
        field: 'date',
        sortable: true,
        format: val => {
          return qdate.formatDate(val, 'YYYY-MM-DD HH:mm:ss')
        }
      }))

      columns.unshift(Object.assign({}, defaultAttr, {
        name: 'id',
        label: 'id',
        field: 'id'
      }))

      return columns
    },

    /*title () {
      var createdBy = this.$ething.arbo.get(this.resource.createdBy())
      var title = this.resource.name()
      if (createdBy) {
        title += ' - ' + createdBy.basename()
      }
      return title
    },*/

    createdBy () {
      return this.$ething.arbo.get(this.resource.createdBy())
    },

    isEmpty () {
      return this.serverData.length === 0
    }

  },

  watch: {
    resource: function (r, old) {
      if (r && r.contentModifiedDate() > this.contentModifiedDate) {
        this.reloadData()
      }
    },

    'add.data': {
      handler: function (values, oldValues) {
        values.forEach( item => {
          if (typeof item.value != item.type) {
            switch (item.type) {
              case 'boolean':
                item.value = !!item.value
                break;
              case 'string':
                item.value = String(item.value)
                break;
              case 'number':
                item.value = 0
                break;
            }
          }
        })
      },
      deep: true
    }

    /*columns: function (col, oldCol) {
      console.log('columns',col, oldCol)
      // calculate the new keys
      var newKeys = []
      col.forEach(c => {
        if (!oldCol.find(oc => oc.name === c.name)){
          newKeys.push(c.name)
        }
      })

      if (newKeys.length) {
        this.visibleColumns = this.visibleColumns.concat(newKeys)
      }
    }*/
  },

  methods: {
    request ({ pagination, filter }) {
      if (!this.resource) return

      // we set QTable to "loading" state
      this.loading = true

      this.contentModifiedDate = this.resource.contentModifiedDate()

      // we do the server data fetch, based on pagination and filter received
      this.resource.select({
        sort: (pagination.descending ? '-' : '+') + pagination.sortBy,
        start: (pagination.page - 1) * pagination.rowsPerPage,
        length: pagination.rowsPerPage
      }).then(data => {
        // updating pagination to reflect in the UI
        this.serverPagination = pagination

        // then we update the rows with the fetched ones
        this.serverData = data

        // finally we tell QTable to exit the "loading" state
        this.loading = false
      }).catch(err => {
        // there's an error... do SOMETHING
      }).finally( () => {
        this.loading = false
      })

    },

    reloadData () {
      this.request({
        pagination: this.serverPagination,
        filter: this.filter
      })
    },

    removeSelection () {
      if (this.selected.length) {
        this.loading = true
        this.resource.removeRow(this.selected.map(item => item.id)).finally(() => {
          this.loading = false
          this.selected = []
        })
      }
    },

    showStats () {
      if (this.statistics === null) {
        this.computeStats()
      }

      this.modalStatistics = true

    },

    computeStats () {

      this.loadingStatistics = true

      this.statistics = {}

      var promises = this.resource.keys().map(key => {
        return this.resource.computeStatistics(key).then(stats => {
          this.statistics[key] = stats
        })
      })

      Promise.all(promises).finally( () => {
        this.loadingStatistics = false
      })
    },

    showAddRow () {
      if (this.add.data.length === 0) {
        this.addRowTmpl()
      }
      this.add.modal = true
    },

    addRowTmpl () {
      var keys = this.resource.keys()
      this.add.data.push({
        key: keys.length ? keys[0] : '',
        type: 'number',
        value: 0
      })
    },

    addRowListKeys () {
      return this.resource.keys().map(k => {
        return {
          label: k,
          value: k
        }
      })
    },

    addRowKeyFilter(terms, { field, list }) {
      return list
    },

    addRowShowKeySuggestion(index) {
      this.$refs['addRowKeyAutocomplete'][index].trigger()
    },

    addRow () {
      var d = {}
      this.add.data.forEach(item => {
        if (item.key) {
          var v = item.value
          if (item.type === 'number') {
            v = parseFloat(v)
          }
          d[item.key] = v
        }
      })
      if (Object.keys(d).length > 0) {
        this.add.loading = true
        this.resource.insert(d).then( () => {
          this.add.error = false
          this.add.modal = false
        }).catch( e => {
          this.add.error = e
        }).finally( () => {
          this.add.loading = false
        })
      }
    },

    format (key, value) {

      if (/date/i.test(key)) {
        var d = new Date(value)
        value = qdate.formatDate(d, 'YYYY-MM-DD HH:mm:ss')
      }

      return value
    }
  },
  mounted () {
    // once mounted, we need to trigger the initial server data fetch
    this.reloadData()
  }

}
</script>

<style lang="stylus" scoped>
@import '~variables'

.add-row-item
  &:not(:first-child)
    border-top 1px solid $blue-2

</style>
