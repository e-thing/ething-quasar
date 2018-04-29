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
    >

      <template slot="top-left" slot-scope="props">
        <div class="q-title q-title-opacity">{{ resource.basename() }} <small v-if="createdBy"> - {{ createdBy.basename() }}</small></div>
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
          :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
          @click="props.toggleFullscreen"
        />
      </template>
    </q-table>

  </q-page>
</template>

<script>

import { date as qdate } from 'quasar'


export default {
  name: 'PageTable',

  data () {
    return {
      loading: true,
      serverPagination: {
        page: 1,
        sortBy: 'date',
        descending: true,
        rowsNumber: 0 // specifying this determines pagination is server-side
      },
      serverData: [],
      filter: '',
      visibleColumns: ['date']
    }
  },

  computed: {
    resource () {
      var id = this.$route.params.id
      var r = this.$store.getters['ething/findOneById'](id)
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
      var createdBy = this.$ething.arbo.findOneById(this.resource.createdBy())
      var title = this.resource.name()
      if (createdBy) {
        title += ' - ' + createdBy.basename()
      }
      return title
    },*/

    createdBy () {
      return this.$ething.arbo.findOneById(this.resource.createdBy())
    },


  },

  watch: {
    resource: function (r, old) {
      if (r && r.contentModifiedDate() > this.contentModifiedDate) {
        this.reloadData()
      }
    },

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
      }).done(data => {
        // updating pagination to reflect in the UI
        this.serverPagination = pagination

        // then we update the rows with the fetched ones
        this.serverData = data

        // finally we tell QTable to exit the "loading" state
        this.loading = false
      }).fail(err => {
        // there's an error... do SOMETHING
      }).always( () => {
        this.loading = false
      })

    },

    reloadData () {
      this.request({
        pagination: this.serverPagination,
        filter: this.filter
      })
    }
  },
  mounted () {
    // once mounted, we need to trigger the initial server data fetch
    this.reloadData()
  }

}
</script>

<style>
</style>
