<template>
  <form-schema-layout class="form-schema-host">
    <div class="row">
      <q-input
        v-bind:value="c_value"
        @input="c_value = $event"
        :error="!!error"
        class="col"
        hide-bottom-space
        dense
      >
        <template v-slot:append>
          <q-icon name="search" class="cursor-pointer">
            <q-popup-proxy transition-show="scale" transition-hide="scale">
              <div style="width: 260px;">
                <div v-if="loading" class="q-ma-md text-center text-faded">
                  <div class="q-ma-md">scanning...</div>
                  <q-spinner-oval color="primary" size="50px" />
                </div>
                <div v-else-if="hosts.length===0" class="q-ma-md text-faded">no host detected</div>
                <q-list separator v-else>
                  <q-btn flat color="faded" icon="refresh" label="refresh" @click="refresh(true)"/>
                  <q-item v-close-popup clickable v-for="(host, index) in hosts" :key="index" @click="c_value = host.hostname || host.ip">
                    <q-item-section>
                      <q-item-label>{{ host.hostname || host.ip }}</q-item-label>
                      <q-item-label caption v-if="host.mac">mac: {{ host.mac }}</q-item-label>
                      <q-item-label caption v-if="host.vendor">vendor: {{ host.vendor }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div>
  </form-schema-layout>
</template>

<script>

import EThing from 'ething-js'
import { FormComponent } from '../core'


var hosts = []
var iat = false
var req = null
const CACHE_VALIDITY = 5 * 60 * 1000 // 1 minute

function refresh (force, cb) {

  if (typeof force === 'function') {
    cb = force
    force = false
  }

  if (iat===false) {
    force = true
  }

  if (force || (Date.now() - iat) > CACHE_VALIDITY) {
    iat = Date.now()
    req = EThing.request({
      url: 'utils/net_list',
      dataType: 'json',
    }).then((data) => {
      hosts = data
    })
  }

  req.finally(() => {
    if (typeof cb === 'function')
      cb(hosts)
  })

}

export default {
  name: 'FormSchemaHost',

  mixins: [FormComponent],

  data () {
    return {
      hosts: [],
      loading: true,
      skipNext: false
    }
  },

  methods: {
    showHosts () {
      if (this.skipNext) {
        this.skipNext = false
        return
      }
      this.refresh()
    },

    refresh (force) {
      this.loading = true
      refresh(force, (hosts) => {
        this.hosts = hosts
        this.loading = false
        this.skipNext = true
        this.$refs.popover.hide()
        this.$refs.popover.show()
      })
    }
  },

  mounted () {

  }

}

</script>
