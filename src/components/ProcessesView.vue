<template>

  <div class="layout">

    <q-list highlight>
      <q-list-header>Processes</q-list-header>
      <q-item v-for="(process, index) in processes" :key="index">
        <q-item-main :label="process.name" />
        <q-item-side>
          {{ process.active ? 'running' : 'stopped' }}
        </q-item-side>
        <q-item-side right>
          {{ duration_to_string(process._duration) }}
        </q-item-side>
      </q-item>
    </q-list>

  </div>

</template>

<script>

function process_compare(a,b) {
  if (a.start_ts < b.start_ts)
    return -1;
  if (a.start_ts > b.start_ts)
    return 1;
  return 0;
}

export default {
    name: 'ProcessesView',

    data () {
      return {
        processes: [],
        timer: null
      }
    },

    methods: {
      updateProcesses () {
        this.$ething.request('/process').then(processes => {
          processes.sort(process_compare)
          processes.reverse()
          this.processes = processes
          this.updateDuration()
        })
      },

      updateDuration () {
        this.processes.forEach(p => {
          p._duration = p.active ? (Date.now() - p.start_ts*1000) : 0
        })
      },

      duration_to_string (duration_ms) {
        var sec_num = Math.floor(duration_ms / 1000);
        var hours   = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = sec_num - (hours * 3600) - (minutes * 60);

        if (hours   < 10) {hours   = "0"+hours;}
        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}
        return hours+':'+minutes+':'+seconds;
      }
    },

    mounted () {
      this.updateProcesses();
      this.timer = setInterval(this.updateProcesses, 2000)
    },

    beforeDestroy () {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
    },

}
</script>

<style scoped lang="stylus">
.layout

  @media screen and (min-width: 600px)
    max-width: 600px;
    margin: 0 auto;

</style>
