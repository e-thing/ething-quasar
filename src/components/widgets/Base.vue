
<script>

export default {

  inheritAttrs: false,

  props: {
    color: String,
    bgColor: String,
    primaryColor: String,
    secondaryColor: String,
    accentColor: String,
    resource: {}
  },

  methods: {
    setError (err) {
      this.$emit('error', err)
    }
  },

  errorHandler: function (err, vm, info) {
    console.error('widget error:', err, vm, info)
    // this.setError(err)
  }
}
</script>
