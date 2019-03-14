
<script>

export default {

  name: 'WWidget',

  inheritAttrs: false,

  props: {
    color: {
      type: String,
      default: '#027be3'
    },
    bgColor: {
      type: String,
      default: '#ffffff'
    }
  },

  methods: {
    setError (err) {
      this.$emit("error", err);
    }
  },

  errorHandler: function (err, vm, info) {
    console.error('widget error:', err, vm, info);
    this.setError(err)
  }
}
</script>
