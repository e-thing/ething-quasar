<template>
  <q-page class="page page-width-md">

    <div class="row page-block" style="background: transparent;">
      <div class="q-gutter-x-xs">
        <q-btn class="bg-white" label="All" flat :color="category==='' ? 'primary' : 'faded'" @click="category = ''"/>
        <q-btn v-for="cat in categories" :key="cat.name" class="bg-white" flat :color="category===cat.name ? 'primary' : 'faded'" @click="category = cat.name">
          <q-icon :name="cat.icon"/>
          <span class="gt-sm q-ml-xs">{{ cat.label }}</span>
        </q-btn>
      </div>

      <q-space/>

      <div class="row q-gutter-x-xs">
        <q-btn-dropdown class="bg-white" color="primary" label="Create" icon="add" flat dense >
          <q-list>
            <q-item v-close-popup clickable @click="create('resources/File')">
              <q-item-section avatar>
                <q-icon :name="$ethingUI.get('resources/File').icon" :color="$ethingUI.get('resources/File').color"/>
              </q-item-section>
              <q-item-section>File</q-item-section>
            </q-item>

            <q-item v-close-popup clickable @click="create('resources/Table')">
              <q-item-section avatar>
                <q-icon :name="$ethingUI.get('resources/Table').icon" :color="$ethingUI.get('resources/Table').color"/>
              </q-item-section>
              <q-item-section>Table</q-item-section>
            </q-item>

            <q-item v-close-popup clickable @click="$router.push('/chart')">
              <q-item-section avatar>
                <q-icon name="mdi-chart-line" :color="$ethingUI.get('resources/File').color"/>
              </q-item-section>
              <q-item-section>Chart</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
    </div>

    <resource-list v-if="resources.length" class="page-block" :resources="resources" />

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
import ResourceQItem from '../components/ResourceQItem'
import ResourceList from '../components/ResourceList'

var categories = [{
  name: 'table',
  label: 'Table',
  icon: 'mdi-table',
  filter (r) {
    return r instanceof this.$ething.Table
  }
},{
  name: 'image',
  label: 'Image',
  icon: 'mdi-file-image',
  filter (r) {
    return r instanceof this.$ething.File && /^image/.test(r.mime())
  }
},{
  name: 'text',
  label: 'Text',
  icon: 'mdi-file-document',
  filter (r) {
    return r instanceof this.$ething.File && /^text/.test(r.mime())
  }
},{
  name: 'chart',
  label: 'Chart',
  icon: 'mdi-chart-line',
  filter (r) {
    return r instanceof this.$ething.File && /\.plot$/.test(r.name())
  }
}]

export default {
  name: 'PageData',

  components: {
    ResourceQItem,
    ResourceList
  },

  data () {
    return {
      categories,
      category: ''
    }
  },

  computed: {
    path () {
      return this.$route.params.path || ''
    },
    resources () {
      var path = this.path
      var globRe = new RegExp('^' + (path ? (path + '/') : '') + '[^/]+$')
      return this.$ething.arbo.find(r => globRe.test(r.name()) && !/^\./.test(r.basename()) && this.matchCategory(r))
    },
    folders () {
      var path = this.path
      if (path && !/\/$/.test(path))
        path += '/'
      var globReS = new RegExp('^' + path)
      var globRe = new RegExp('^' + path + '[^/]+/')
      return this.$ething.arbo.find(r => (r instanceof this.$ething.File || r instanceof this.$ething.Table) && globRe.test(r.name()))
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
    matchCategory (r) {
      var category = this.category

      if (category) {
        for (var i in this.categories) {
          if (this.categories[i].name === category) {
            return this.categories[i].filter.call(this, r)
          }
        }
      } else {
        // all
        for (var i in this.categories) {
          if (this.categories[i].filter.call(this, r)) {
            return true
          }
        }
      }
    },

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
      this.$router.push({
        name: 'create',
        params: {
          type
        }
      })
    },
  }
}
</script>
