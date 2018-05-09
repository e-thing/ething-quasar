<template>
  <q-page class="q-mb-xl">

    <q-breadcrumbs class="q-pa-md">
      <q-breadcrumbs-el v-for="(item, index) in pathItems" :key="index" :label="item.label" :icon="item.icon" :to="item.link" />
    </q-breadcrumbs>

    <!--<q-btn-dropdown color="primary" label="Create">
      <q-list link>
        <q-item v-close-overlay @click.native="create('File')">
          <q-item-side :icon="$ething.meta.get('File').icon" inverted :color="$ething.meta.get('File').color" />
          <q-item-main>
            <q-item-tile label>File</q-item-tile>
          </q-item-main>
        </q-item>
        <q-item v-close-overlay @click.native="create('Table')">
          <q-item-side :icon="$ething.meta.get('Table').icon" inverted :color="$ething.meta.get('Table').color" />
          <q-item-main>
            <q-item-tile label>Table</q-item-tile>
          </q-item-main>
        </q-item>
      </q-list>
    </q-btn-dropdown>-->

    <div v-if="resources.length">
      <q-list link no-border>

        <div v-if="folders.length">
          <q-list-header inset>Folders</q-list-header>
          <q-item v-for="(folder, key) in folders" :key="folder" :to="pJoin(path, folder)" append>
            <q-item-side icon="folder" inverted color="yellow" />
            <q-item-main>
              <q-item-tile label>{{ folder }}</q-item-tile>
            </q-item-main>
          </q-item>
        </div>

        <div v-if="files.length">
          <q-item-separator inset v-if="folders.length"/>
          <q-list-header inset>Files</q-list-header>
          <q-item v-for="file in files" :key="file.id()" :to="$ui.open(file)">
            <q-item-side :icon="$ething.meta.get(file).icon" inverted :color="$ething.meta.get(file).color" />
            <q-item-main>
              <q-item-tile label>{{ file.basename() }}</q-item-tile>
              <q-item-tile sublabel>{{ $ui.dateToString(file.modifiedDate()) }}</q-item-tile>
              <q-item-tile sublabel>{{ $ui.sizeToString(file.size()) }}</q-item-tile>
            </q-item-main>
            <q-item-side right>
              <q-btn icon="delete" round flat dense color="negative" @click.stop="onRemoveClick(file)"/>
            </q-item-side>
            <q-item-side right>
              <q-btn icon="settings" round flat dense @click.stop="settingsClick(file)"/>
            </q-item-side>
          </q-item>
        </div>

        <div v-if="tables.length">
          <q-item-separator inset v-if="folders.length || files.length"/>
          <q-list-header inset>Table</q-list-header>
          <q-item v-for="table in tables" :key="table.id()" :to="$ui.open(table)">
            <q-item-side :icon="$ething.meta.get(table).icon" inverted :color="$ething.meta.get(table).color" />
            <q-item-main>
              <q-item-tile label>{{ table.basename() }}</q-item-tile>
              <q-item-tile sublabel>{{ $ui.dateToString(table.modifiedDate()) }}</q-item-tile>
              <q-item-tile sublabel>{{ table.length() }} rows</q-item-tile>
            </q-item-main>
            <q-item-side right>
              <q-btn icon="insert chart" round flat dense color="secondary" @click.stop="chartClick(table)"/>
            </q-item-side>
            <q-item-side right>
              <q-btn icon="delete" round flat dense color="negative" @click.stop="onRemoveClick(table)"/>
            </q-item-side>
            <q-item-side right>
              <q-btn icon="settings" round flat dense @click.stop="settingsClick(table)"/>
            </q-item-side>
          </q-item>
        </div>

      </q-list>
    </div>

    <div v-else class="q-pa-md">
      No items found.
    </div>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-fab
            color="primary"
            icon="add"
            direction="up"
        >
            <q-fab-action
                :color="$ething.meta.get('File').color"
                @click="create('File')"
                :icon="$ething.meta.get('File').icon"
            />
            <q-fab-action
                :color="$ething.meta.get('Table').color"
                @click="create('Table')"
                :icon="$ething.meta.get('Table').icon"
            />
        </q-fab>
    </q-page-sticky>

  </q-page>
</template>

<script>
import EThing from 'ething-js'

export default {
  name: 'PageData',

  data () {
    return {}
  },

  computed: {
    path () {
      return this.$route.params.path || ''
    },
    resources () {
      return this.$store.getters['ething/glob'](this.path)
    },
    folders () {
      var path = this.path
      if (path && !/\/$/.test(path))
        path += '/'
      var globReS = new RegExp('^' + path)
      var globRe = new RegExp('^' + path + '[^/]+/')
      return this.$store.getters['ething/filter'](r => (r instanceof this.$ething.File || r instanceof this.$ething.Table) && globRe.test(r.name()))
        .map(r => r.dirname().replace(globReS, '').replace(/\/.*$/, ''))
        .filter((value, index, self) => self.indexOf(value) === index)
    },
    files () {
      return this.resources.filter( (r) => r instanceof this.$ething.File )
    },
    tables () {
      return this.resources.filter( (r) => r instanceof this.$ething.Table )
    },
    pathItems () {
      var pathItems = (this.path).split('/')
      pathItems.unshift('Home')
      var items = []
      var p = '/data'
      pathItems.forEach( (pathItem, i) => {
        if (i)
          p += '/' + pathItem

        if (!pathItem) return

        items.push({
          label: pathItem,
          link: p,
          icon: i ? '' : 'home'
        })
      })
      return items
    }
  },

  methods: {

    pJoin (a, b) {
      if (!a) {
        return b
      }
      if (/^\//.test(b)) {
        // absolute
        return b
      }
      a = a.replace(/\/+$/, '')
      return a + '/' + b
    },

    settingsClick (resource) {
      this.$router.push('/resource/' + resource.id())
    },

    chartClick (resource) {
      this.$router.push('/chart/' + resource.id())
    },

    onRemoveClick (resource) {
      var name = resource.name()

      var children = this.$ething.arbo.list().filter(r => {
        return r.createdBy() === resource.id()
      })

      var items = []

      if (children.length) {
        items.push({label: 'Remove also the children resources', value: 'removeChildren', color: 'secondary'})
      }

      this.$q.dialog({
        title: 'Remove',
        message: 'Do you really want to remove definitely the ' + resource.type() + ' "' + resource.name() + '" ?',
        options: {
          type: 'checkbox',
          model: [],
          items
        },
        ok: 'Remove',
        cancel: 'Cancel'
      }).then((data) => {
        resource.remove(data.indexOf('removeChildren') !== -1).then( () => {
          this.$q.notify(name + ' removed !')
        })
      })
    },

    create (type) {
      this.$router.push('/create/'+type)
    },
  }
}
</script>

<style>
</style>
