
<script>
import WResource from './WResource'


function read (options, resource) {
  return new Promise( (resolve, reject) => {
    if (options.attr) {
      resolve(resource.attr(options.attr))
    } else if (options.fn) {
      resource.execute(options.fn).then(v => {
        resolve(v)
      }).catch(e => {
        reject(e)
      })
    } else if (options.dataProp) {
      resolve(resource.data(options.dataProp))
    } else {
      reject(new Error('invalid widget configuration'))
    }
  })
}


export default {
    name: 'WDeviceRead',

    mixins: [WResource],

    props: {
      fn: {},
      attr: {},
      dataProp: {}
    },

    data () {
        return {
            value: null,
            lastUpdate: null,
            reading: false
        }
    },

    watch: {
      r () {
        if (!this.lastUpdate || this.r.modifiedDate() > this.lastUpdate) {
          this.update()
        }
      }
    },

    methods: {

      read () {
        this.reading = true

        var promise = read(this, this.r)

        promise.finally(() => {
          this.reading = false
        })

        return promise
      },

      update () {
        this.lastUpdate = this.r.modifiedDate()
        this.read().then(v => {
          this.value = v
        })
      }
    },

    mounted () {
      this.update()
    },

    read

}

</script>
