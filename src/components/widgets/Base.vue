
<script>

export default {

  inheritAttrs: false,

  props: {
    color: {
      type: String,
    },
    bgColor: {
      type: String,
    },
    resource: {}
  },

  methods: {
    setError (err) {
      this.$emit("error", err);
    }
  },

  errorHandler: function (err, vm, info) {
    console.error('widget error:', err, vm, info);
    //this.setError(err)
  }
}
</script>
