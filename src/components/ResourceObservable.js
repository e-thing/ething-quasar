
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
    resource: {
      handler (r, old_r) {
        if (r!==old_r) {
          // the resource changed
          this.lastUpdate = null
        }
        if (!this.lastUpdate || r.modifiedDate() > this.lastUpdate) {
          this.lastUpdate = r.modifiedDate()
          if (this.attribute) {
            var attributes = Array.isArray(this.attribute) ? this.attribute : [this.attribute]

            if (!this.lastValue) {
              this.lastValue = []
            }

            attributes.forEach((a, i) => {
              var value = r.attr(a);
              var lastValue = (this.lastValue && i<this.lastValue.length) ? this.lastValue[i] : undefined;
              if (lastValue !== value) {
                this.$emit('change', r, a, value)
              }
              this.lastValue[i] = value
            })

            return // no change
          }
          this.$emit('change', r)
        }
      },
      deep: true
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
