<template>

  <div v-if="loading===false">

    <q-input v-model="filter" placeholder="filter" class="inline"/>
    <q-select
      class="inline"
      v-model="length"
      :options="lengthOptions"
      suffix="results"
    />
    <q-btn color="primary" flat icon="refresh" label="refresh" @click="load"/>

    <div class="column gutter-y-xs q-mt-sm">

      <div class="log row gutter-x-xs" :class="log.cls" v-for="(log, index) in logs" :keys="index">
        <div class="date col-md-auto col-sm-4 text-faded">
          {{ log.date }}
        </div>
        <div class="level col-md-1 col-sm-4 text-faded">
          {{ log.level }}
        </div>
        <div class="level col-md-2 col-sm-4 text-faded">
          {{ log.name }}
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
          logs: [],
          filter: '',
          length: 100,
          lengthOptions: [100, 200, 500, 1000].map(l => {
            return {
              label: String(l),
              value: l
            }
          })
        }
    },

    methods: {

      load () {
        this.loading = true

        this.$ething.request({
          url: 'utils/read_log?line='+this.length+'&filter='+ encodeURIComponent(this.filter),
          dataType: 'json',
        }).then(logs => {

          this.logs = logs.map((line) => {
            // parsing
            var d = line.split('::', 4);
            
  					if(d.length==4){
  						var date = d[0].trim(),
                name = d[1].trim(),
  							level = d[2].trim().toUpperCase(),
  							message = d[3].trim();

              return {
                date,
                name,
                level,
                cls: level.toLowerCase(),
                message
              }
  					}

            return
          }).filter(log => {
            return !!log
          }).reverse()
        }).finally(() => {
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

  &.debug
    color $tertiary

  &.info
    color $info

  &.warning
    color $warning

  &.error
    color $negative

  &.fatal
    color $negative
</style>
