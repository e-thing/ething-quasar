<template>
  <q-btn flat :icon="icon" :label="label" :loading="loading" @click="run" />
</template>

<script>
import WResource from './WResource'

const defaultLabel = 'run'

export default {
    name: 'WScript',

    mixins: [WResource],

    props: {
      icon: String,
      label: {
        type: String,
        default: defaultLabel
      },
      arguments: String,
    },

    data () {
      return {
        loading: false
      }
    },

    methods: {
      run () {
        this.loading = true
        this.r.execute(this.arguments).then(result => {
          if (result.ok) {
            this.setError(false)
          } else {
            this.setError('error: ' + result.stderr)
          }
        }).catch((err) => {
          this.setError(err)
        }).finally(() => {
          this.loading = false
        })
      }
    },

    meta: {
      name: 'button',
      minWidth: 50,
      minHeight: 50,
      options: {
        properties: {
          label: {
            type: 'string',
            default: defaultLabel
          },
          arguments: {
            description: 'the arguments to pass to the script',
            type: 'string'
          }
        }
      }
    }

}
</script>

<style scoped>
</style>
