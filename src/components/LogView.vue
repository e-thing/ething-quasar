<template>

  <div v-if="loading===false">

    <q-btn color="primary" flat icon="refresh" label="refresh" @click="load"/>

    <div class="column gutter-y-xs q-mt-sm">

      <div class="log row gutter-x-xs" :class="log.cls" v-for="(log, index) in logs" :keys="index">
        <div class="date col-md-auto col-sm-6 text-faded">
          {{ log.date }}
        </div>
        <div class="level col-md-1 col-sm-6 text-faded">
          {{ log.level }}
        </div>
        <div class="message col-md col-sm-12">
          {{ log.message }}
        </div>
      </div>

    </div>
  </div>
  <div v-else>loading ...</div>

</template>

<script>

export default {
    name: 'LogView',

    data () {
        return {
          loading: true,
          length: 100,
          logs: []
        }
    },

    methods: {

      load () {
        this.loading = true

        this.$ething.request({
          url: 'utils/read_log?line='+this.length,
          dataType: 'json',
        }).done(logs => {

          this.logs = logs.map((line) => {
            // parsing
            var d = line.split('::', 3);
  					if(d.length==3){
  						var date = d[0].trim(),
  							level = d[1].trim().toUpperCase(),
  							message = d[2].trim();

              return {
                date,
                level,
                cls: level.toLowerCase(),
                message
              }
  					}

            return
          }).filter(log => {
            return !!log
          }).reverse()
        }).always(() => {
          this.loading = false
        })
      },

    },

    mounted () {
      this.load()
    }

}
</script>

<style lang="stylus" scoped>
@import '~variables'

.log
  &:hover
    background-color $grey-2

  .debug
    color $tertiary

  .info
    color $info

  .warning
    color $warning

  .error
    color $negative

  .fatal
    color $negative
</style>
