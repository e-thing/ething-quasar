<template>
  <q-page class="q-mb-xl">

    <div class="row justify-between">
    <q-breadcrumbs class="q-pa-md">
      <q-breadcrumbs-el v-for="(item, index) in pathItems" :key="index" :label="item.label" :icon="item.icon" :to="item.link" />
    </q-breadcrumbs>

    <q-btn-dropdown color="primary" label="Create" icon="add" flat >
      <q-list link>
        <q-item v-close-overlay @click.native="create('File')">
          <q-item-side :icon="$ethingUI.get('resources/File').icon" :color="$ethingUI.get('resources/File').color" />
          <q-item-main>
            <q-item-tile label>File</q-item-tile>
          </q-item-main>
        </q-item>

        <q-item v-close-overlay @click.native="create('Table')">
          <q-item-side :icon="$ethingUI.get('resources/Table').icon" :color="$ethingUI.get('resources/Table').color" />
          <q-item-main>
            <q-item-tile label>Table</q-item-tile>
          </q-item-main>
        </q-item>

        <q-item v-close-overlay @click.native="$router.push('/chart')">
          <q-item-side icon="mdi-chart-line" :color="$ethingUI.get('resources/File').color" />
          <q-item-main>
            <q-item-tile label>Chart</q-item-tile>
          </q-item-main>
        </q-item>
      </q-list>
    </q-btn-dropdown>
    </div>

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
          <resource-q-item v-for="file in files" :key="file.id()" :resource="file" />
        </div>

        <div v-if="tables.length">
          <q-item-separator inset v-if="folders.length || files.length"/>
          <q-list-header inset>Table</q-list-header>
          <resource-q-item v-for="table in tables" :key="table.id()" :resource="table" />
        </div>

      </q-list>
    </div>

    <div v-else class="absolute-center text-center">
      <p>
        <img
          src="~assets/sad.svg"
          style="width:30vw;max-width:150px;"
        >
      </p>
      <p class="text-faded">Nothing found !</p>
    </div>

  </q-page>
</template>

<script>
import ResourceQItem from 'ething-quasar-core/src/components/ResourceQItem'

export default {
  name: 'PageData',

  components: {
    ResourceQItem
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

    create (type) {
      this.$router.push('/create/'+type)
    },
  }
}
</script>

<style>
</style>
