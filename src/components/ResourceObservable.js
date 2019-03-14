
export default {
  name: 'ResourceObservable',

  props: ['resource', 'attribute'],

  data () {
      return {
          lastValue: undefined,
          lastUpdate: null
      }
  },

  watch: {
    resource (r, old_r) {
      if (r!==old_r) {
        // the resource changed
        this.lastUpdate = null
      }
      if (!this.lastUpdate || r.modifiedDate() > this.lastUpdate) {
        this.lastUpdate = r.modifiedDate()
        if (this.attribute) {
          var value = r.attr(this.attribute)
          if (this.lastValue !== value) {
            this.$emit('change', r, value)
          }
          this.lastValue = value
          return // no change
        }
        this.$emit('change', r)
      }
    },
    attribute () {
      // reset
      this.lastValue = undefined
    }
  },

  render (h) {
    return
  }
}
