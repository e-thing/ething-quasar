<template>
  <q-page>

    <q-breadcrumbs class="q-pa-md">
      <q-breadcrumbs-el v-for="(item, index) in pathItems" :key="index" :label="item.label" :icon="item.icon" :to="item.link" />
    </q-breadcrumbs>

    <div v-if="resources.length">
      <q-list link no-border>

        <div v-if="folders.length">
          <q-list-header inset>Folders</q-list-header>
          <q-item v-for="folder in folders" :key="folder.id()" :to="folder.name()" append>
            <q-item-side :icon="$ething.meta.get(folder).icon" inverted :color="$ething.meta.get(folder).color" />
            <q-item-main>
              <q-item-tile label>{{ folder.basename() }}</q-item-tile>
              <q-item-tile sublabel>{{ dateToString(folder.modifiedDate()) }}</q-item-tile>
            </q-item-main>
          </q-item>
        </div>

        <div v-if="files.length">
          <q-item-separator inset v-if="folders.length"/>
          <q-list-header inset>Files</q-list-header>
          <q-item v-for="file in files" :key="file.id()" :to="open(file)">
            <q-item-side :icon="$ething.meta.get(file).icon" inverted :color="$ething.meta.get(file).color" />
            <q-item-main>
              <q-item-tile label>{{ file.basename() }}</q-item-tile>
              <q-item-tile sublabel>{{ dateToString(file.modifiedDate()) }}</q-item-tile>
              <q-item-tile sublabel>{{ sizeToString(file.size()) }}</q-item-tile>
            </q-item-main>
            <q-item-side right icon="delete" color="negative" @click.native.stop="onRemoveClick(file)"/>
            <q-item-side right icon="settings" @click.native.stop="settingsClick(file)"/>
          </q-item>
        </div>

        <div v-if="tables.length">
          <q-item-separator inset v-if="folders.length || files.length"/>
          <q-list-header inset>Table</q-list-header>
          <q-item v-for="table in tables" :key="table.id()" :to="open(table)">
            <q-item-side :icon="$ething.meta.get(table).icon" inverted :color="$ething.meta.get(table).color" />
            <q-item-main>
              <q-item-tile label>{{ table.basename() }}</q-item-tile>
              <q-item-tile sublabel>{{ dateToString(table.modifiedDate()) }}</q-item-tile>
              <q-item-tile sublabel>{{ table.length() }} rows</q-item-tile>
            </q-item-main>
            <q-item-side right icon="insert chart" color="secondary" @click.native.stop="chartClick(table)"/>
            <q-item-side right icon="delete" color="negative" @click.native.stop="onRemoveClick(table)"/>
            <q-item-side right icon="settings" @click.native.stop="settingsClick(table)"/>
          </q-item>
        </div>

      </q-list>
    </div>

    <div v-else class="q-pa-md">
      No items found.
    </div>


  </q-page>
</template>

<script>
import EThing from 'ething-js'
import { date } from 'quasar'
import { format } from 'quasar'
const { humanStorageSize } = format

export default {
  name: 'PageData',

  data () {
    return {}
  },

  computed: {
    resources () {
      return this.$store.getters['ething/glob'](this.$route.params.path || '')
    },
    folders () {
      return this.resources.filter( (r) => r instanceof EThing.Folder ).filter(r => {
        // only folders that have files or tables in it !
        return r.find(r => {
          return r instanceof EThing.File || r instanceof EThing.Table
        }).length
      })
    },
    files () {
      return this.resources.filter( (r) => r instanceof EThing.File )
    },
    tables () {
      return this.resources.filter( (r) => r instanceof EThing.Table )
    },
    pathItems () {
      var pathItems = (this.$route.params.path || '').split('/')
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
    dateToString (d) {
      var ts = d.getTime()
      return date.formatDate(ts, 'YYYY-MM-DD HH:mm')
    },

    sizeToString (s) {
      return humanStorageSize(s)
    },

    settingsClick (resource) {
      this.$router.push('/resource/' + resource.id())
    },

    chartClick (resource) {
      this.$router.push('/chart/' + resource.id())
    },

    onRemoveClick (resource) {
      this.$q.dialog({
        title: 'Remove',
        message: 'Do you really want to remove definitely the ' + resource.type() + ' "' + resource.name() + '" ?',
        options: {
          type: 'checkbox',
          model: [],
          items: [
            {label: 'Remove also the children resources', value: 'removeChildren', color: 'secondary'},
          ]
        },
        ok: 'Remove',
        cancel: 'Cancel'
      }).then((data) => {
        resource.remove(data.indexOf('removeChildren') !== -1).done( () => {
          this.$q.notify('Removed !')
        })
      })
    },

    open (resource) {
      if (resource instanceof EThing.File) {
        if (/\.plot$/.test(resource.basename())) {
          return '/chart/' + resource.id()
        } else if (/image/.test(resource.mime())) {
          return '/image/' + resource.id()
        } else {
          return '/text/' + resource.id()
        }
      }
      else if (resource instanceof EThing.Table) {
        return '/table/' + resource.id()
      }
    }
  }
}
</script>

<style>
</style>
