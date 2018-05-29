
<script>

export default {
    name: 'WWidget',

    data () {
      return {
        error: false
      }
    },

    watch: {
      error (err) {
        console.log('err',err)
        this.$emit('error', err)
      }
    },

    methods: {
      setError (err) {
        this.error = err
      }
    }

}
</script>
