<template>
  <div class="layout">

    <q-card class="q-ma-sm">
      <q-card-title>
        Export
        <!--<span slot="subtitle">Subtitle</span>-->
        <q-icon slot="right" name="mdi-cloud-download" />
      </q-card-title>
      <q-card-main>
        Export all your data for backup.
      </q-card-main>
      <q-card-separator />
      <q-card-actions>
        <q-btn flat :loading="exportLoading" @click="do_export">Export</q-btn>
      </q-card-actions>
    </q-card>

    <q-card class="q-ma-sm">
      <q-card-title>
        Import
        <!--<span slot="subtitle">Subtitle</span>-->
        <q-icon slot="right" name="mdi-cloud-upload" />
      </q-card-title>
      <q-card-main>
        Import data from a backup file.

        <div class="q-mt-md">
          <input ref="file" type="file" class="cursor-pointer" accept=".json" @change="importFileChange">
        </div>

      </q-card-main>
      <q-card-separator />
      <q-card-actions>
        <q-btn flat :loading="importLoading" @click="confirm(do_import)">Import</q-btn>
      </q-card-actions>
    </q-card>

    <q-card class="q-ma-sm">
      <q-card-title>
        Clear
        <!--<span slot="subtitle">Subtitle</span>-->
        <q-icon slot="right" name="mdi-delete" />
      </q-card-title>
      <q-card-main>
        Clear all your data.
      </q-card-main>
      <q-card-separator />
      <q-card-actions>
        <q-btn flat :loading="clearLoading" @click="confirm(do_clear)">Clear</q-btn>
      </q-card-actions>
    </q-card>


  </div>

</template>

<script>

export default {
    name: 'BackupView',

    data () {

        return {
          exportLoading: false,
          importLoading: false,
          importFileReadLoading: false,
          importFile: null,
          clearLoading: false
        }
    },

    methods: {

      do_export () {

        this.exportLoading = true

        EThing.request({
          url: 'utils/export',
          dataType: 'json'
        }).then((data) => {

          this.$ethingUI.utils.saveAs(data, 'ething_data.json')

        }).catch(err => {
          console.error(err)
        }).finally(() => {
          this.exportLoading = false
        })

      },

      confirm (done) {
        this.$q.dialog({
          title: 'Are you sure ?',
          color: 'primary',
          message: 'All your data will be lost. Are you sure you want to proceed ?',
          ok: 'OK',
          cancel: 'Cancel'
        }).then(() => {
          done()
        }).catch(() => {

        })
      },

      do_import () {
        if (this.importFile) {

          this.importLoading = true

          EThing.request({
            method: 'POST',
            url: 'utils/import',
            data: this.importFile
          }).then((data) => {

          }).catch(err => {
            console.error(err)
          }).finally(() => {
            this.importLoading = false
          })
        }
      },

      do_clear () {
        this.clearLoading = true

        EThing.request({
          url: 'utils/reset'
        }).then((data) => {

        }).catch(err => {
          console.error(err)
        }).finally(() => {
          this.clearLoading = false
        })
      },

      importFileChange (e, files) {
        files = Array.prototype.slice.call(files || e.target.files)

        this.importFile = null

        if (files && files.length) {
          var file = files[0]

          this.importFileReadLoading = true

          let fileReader = new FileReader()
          fileReader.onloadend = (e) => {
            const content = fileReader.result
            console.log(content)
            this.importFileReadLoading = false
            this.importFile = {
              content
            }
          }
          fileReader.readAsText(file)

        }

      },

    },

}
</script>

<style scoped lang="stylus">
.layout

  @media screen and (min-width: 600px)
    max-width: 600px;
    margin: 0 auto;

</style>
