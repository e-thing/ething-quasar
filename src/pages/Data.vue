<template>
  <q-page class="page page-width-md">

    <resource-list
      class="page-block"
      resources="resources/Table resources/File"
      :categories="categories"
      :create-types="createTypes"
    />

  </q-page>
</template>

<script>
import ResourceQItem from '../components/ResourceQItem'
import ResourceList from '../components/ResourceList'


export default {
  name: 'PageData',

  components: {
    ResourceQItem,
    ResourceList
  },

  data () {
    return {
      categories: ['resources/Table',{
        label: 'Image',
        icon: 'mdi-file-image',
        filter: r => r instanceof this.$ething.File && /^image/.test(r.mime())
      },{
        label: 'Text',
        icon: 'mdi-file-document',
        filter: r => r instanceof this.$ething.File && /^text/.test(r.mime())
      },{
        label: 'Chart',
        icon: 'mdi-chart-line',
        filter: r => r instanceof this.$ething.File && /\.plot$/.test(r.name())
      }],
      createTypes: [
        'resources/Table',
        'resources/File',
        {
          label: 'Chart',
          icon: 'mdi-chart-line',
          color: this.$ethingUI.get('resources/File').color,
          description: 'build dynamic chart',
          click: () => {
            this.$router.push('/chart')
          }
        }
      ]
    }
  },

  computed: {

  },

  methods: {

  }
}
</script>
