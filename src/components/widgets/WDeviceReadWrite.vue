
<script>
import WDeviceRead from './WDeviceRead'

function write (options, resource, value) {

  var attr_setter = options.attr_setter
  var fn_setter = options.fn_setter
  var dataProp_setter = options.dataProp_setter


  if (!(attr_setter || fn_setter || dataProp_setter)) {
    // no setter provided !
    // same as getter
    if (options.attr) attr_setter = options.attr
    else if (options.fn) fn_setter = options.fn
    else if (options.dataProp) dataProp_setter = options.dataProp
  }

  return new Promise( (resolve, reject) => {
    if (attr_setter) {
      resource.set({
        attr_setter: value
      }).then(() => {
        resolve()
      }).catch(e => {
        reject(e)
      })
    } else if (fn_setter) {
      resource.execute(fn_setter, value).then(() => {
        resolve()
      }).catch(e => {
        reject(e)
      })
    } else if (dataProp_setter) {
      resource.setData(dataProp_setter,  value).then(() => {
        resolve()
      }).catch(e => {
        reject(e)
      })
    } else {
      reject(new Error('invalid widget configuration'))
    }
  })
}

export default {
    name: 'WDeviceReadWrite',

    mixins: [WDeviceRead],

    props: {
      fn_setter: {},
      attr_setter: {},
      dataProp_setter: {}
    },

    data () {
      return {
        writing: false
      }
    },

    methods: {
      write (value) {
        this.writing = true

        var promise = write(this, this.r, value)

        promise.finally(() => {
          this.writing = false
          this.update()
        })

        return promise
      },
    },

    write

}

</script>
