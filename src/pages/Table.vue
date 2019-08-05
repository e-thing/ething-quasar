<template>
  <q-page>

    <div class="page-fit scroll">
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
        class="page-block"
      >

        <template slot="top-left" slot-scope="props">
          <div class="text-h6">{{ resource.basename() }} <small v-if="createdBy" class="cursor-pointer text-faded" @click="$ethingUI.open(createdBy)"> - {{ createdBy.basename() }}</small></div>
        </template>

        <template slot="top-right" slot-scope="props">

          <q-select
            v-model="visibleColumns"
            multiple
            borderless
            dense
            options-dense
            display-value="Columns"
            emit-value
            map-options
            :options="columns"
            option-value="name"
            color="faded"
          />

          <q-btn
            flat round dense
            icon="mdi-chart-line"
            color="faded"
            @click="$ethingUI.open(resource, 'chart')"
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
            icon="mdi-filter"
            :color="filter ? 'secondary' : 'faded'"
            @click="showFilter"
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
    </div>

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

          <div class="q-mb-md q-mt-lg text-h6"><q-icon name="mdi-menu-right" /> column: {{ key }}</div>

          <div class="q-mb-md q-ml-lg">
            <div v-if="statistics[key]" class="row">
              <template v-for="(value, key) in statistics[key]" v-if="value !== null">
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

      <span slot="buttons-right">
        <q-btn
          color="primary"
          @click="addRowTmpl"
          icon="add"
          label="add another column"
          flat
          size="md"
        />
      </span>

      <q-card flat>
        <q-card-section v-for="(item, index) in add.data" :key="index">

          <q-select
            v-model.trim="item.key"
            use-input
            input-debounce="0"
            @new-value="createColumnValue"
            :options="resource.keys()"
          />

          <q-select
            v-model="item.type"
            :options="add.typeOptions"
            label="Type"
            emit-value
          />

          <q-input
            v-if="item.type==='string'"
            v-model="item.value"
            @blur="$v.add.data.$each[index].value.$touch"
            label="Value"
          />
          <q-input
            v-else-if="item.type==='number'"
            v-model="item.value"
            type="number"
            label="Value"
          />
          <q-select
            v-else-if="item.type==='boolean'"
            v-model="item.value"
            :options="[{label: 'True', value: true}, {label: 'False', value: false}]"
            @blur="$v.add.data.$each[index].value.$touch"
            label="Value"
          />

        </q-card-section>

        <q-card-section>
          <q-banner
              v-if="add.error"
              class="bg-red text-white"
          >
            <q-icon left name="mdi-alert"/> {{ String(add.error) }}
          </q-banner>
        </q-card-section>
      </q-card>

    </modal>

    <modal v-model="filterModal" title="Filter" icon="mdi-filter" valid-btn-label="Filter" @valid="validFilter">
      <q-card>
        <q-card-section>
          Enter an ObjectPath expression to filter the data.
          See <a href="http://objectpath.org" target="_blank">ObjectPath website</a> for more details.
        </q-card-section>

        <q-card-section>
          <q-input v-model="filterModel" placeholder="$.temperature > 20 ..." />
        </q-card-section>

        <q-card-section>
            <h6>Examples</h6>

            <p class="caption">Comparison operators</p>
            <pre>$.temperature is 20</pre>
            <pre>$.temperature is not 20</pre>
            <pre>$.temperature > 20</pre>

            <p class="caption">Boolean logic operators</p>
            <pre>$.temperature > 10 and $.temperature < 20</pre>
            <pre>$.state is 'foo' or $.state is 'bar'</pre>

            <p class="caption">Membership</p>
            <pre>$.state in ['foo', 'bar']</pre>
            <pre>$.state not in ['foo', 'bar']</pre>

        </q-card-section>
      </q-card>

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
      },
      filter: '',
      filterModal: false,
      filterModel: ''
    }
  },

  computed: {
    resource () {
      var id = this.$route.params.id
      var r = this.$ething.arbo.get(id)
      if (id && id.length) {
        if (!r) {
          this.$router.replace('/404')
        }
      }

      if (!this.filter) this.serverPagination.rowsNumber = r.length()
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

    filter: function (val, oldVal) {
      this.serverPagination.rowsNumber = this.resource.length()
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

  },

  methods: {

    createColumnValue (val, done) {
      // Calling done(var) when new-value-mode is not set or "add", or done(var, "add") adds "var" content to the model
      // and it resets the input textbox to empty string
      // ----
      // Calling done(var) when new-value-mode is "add-unique", or done(var, "add-unique") adds "var" content to the model
      // only if is not already set
      // and it resets the input textbox to empty string
      // ----
      // Calling done(var) when new-value-mode is "toggle", or done(var, "toggle") toggles the model with "var" content
      // (adds to model if not already in the model, removes from model if already has it)
      // and it resets the input textbox to empty string
      // ----
      // If "var" content is undefined/null, then it doesn't tampers with the model
      // and only resets the input textbox to empty string

      if (val.length > 0) {
        if (!this.resource.keys().includes(val)) {
          done(val, 'add-unique')
        }
      }
    },

    request ({ pagination, filter }, done, err) {
      if (!this.resource) return

      // we set QTable to "loading" state
      this.loading = true

      this.contentModifiedDate = this.resource.contentModifiedDate()

      var rowsPerPage = pagination.rowsPerPage
      var page = pagination.page

      // we do the server data fetch, based on pagination and filter received
      this.resource.select({
        sort: (pagination.descending ? '-' : '+') + pagination.sortBy,
        start: (pagination.page - 1) * pagination.rowsPerPage,
        length: pagination.rowsPerPage,
        query: filter || this.filter
      }).then(data => {

        if (data.length < rowsPerPage) {
          // end of data
          var rowsNumber = (page - 1) * rowsPerPage + data.length
          pagination.rowsNumber = rowsNumber
        }

        // updating pagination to reflect in the UI
        this.serverPagination = pagination

        // then we update the rows with the fetched ones
        this.serverData = data

        if (done) done()
      }).catch(e => {
        // there's an error... do SOMETHING

        this.$q.dialog({
          title: 'Error',
          message: 'an error occurs: ' + String(e),
          color: 'negative'
        })

        if (err) err(e)
      }).finally( () => {
        this.loading = false
      })

    },

    reloadData (done, err) {
      this.request({
        pagination: this.serverPagination
      }, done, err)
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

    showFilter () {
      this.filterModal = true
    },

    validFilter () {
      this.filter = this.filterModel.trim()
      this.filterModal = false
      this.reloadData(null, (err) => {
        this.filter = '' // remove invalid filter
      })
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


</style>
