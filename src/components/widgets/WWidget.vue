
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

  data() {
    return {
      error: false
    };
  },
  watch: {
    error(value, oldValue) {
      this.$emit("error", value);
    }
  },
  methods: {
    setError (err) {
      this.error = err
    }
  },

  errorHandler: function (err, vm, info) {
    this.error = String(err)
  }
}
</script>
