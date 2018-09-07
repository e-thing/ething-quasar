<template>
  <div class="form-schema-host">
    <small v-if="schema.description" class="form-schema-description">{{ schema.description }}</small>
    <div class="row">
      <q-input
        v-bind:value="castedModel"
        v-on:input="setValue"
        :error="$v.value.$error"
        class="col"
      />
      <q-btn flat color="faded" icon="search" class="col-auto">
        <q-popover @show="showHosts" anchor="bottom right" self="top right" fit>
          <div style="width: 260px;">
            <div v-if="loading" class="q-ma-md text-center text-faded">
              <div class="q-ma-md">scanning...</div>
              <q-spinner-oval color="primary" size="50px" />
            </div>
            <div v-else-if="hosts.length===0" class="q-ma-md text-faded">no host detected</div>
            <q-list separator link v-else>
              <q-btn flat color="faded" icon="refresh" label="refresh" @click="refresh(true)"/>
              <q-item v-close-overlay v-for="(host, index) in hosts" :key="index" @click.native="setValue(host.hostname || host.ip)">
                <q-item-main>
                  <q-item-tile label>{{ host.hostname || host.ip }}</q-item-tile>
                  <q-item-tile sublabel v-if="host.mac">mac: {{ host.mac }}</q-item-tile>
                  <q-item-tile sublabel v-if="host.vendor">vendor: {{ host.vendor }}</q-item-tile>
                </q-item-main>
              </q-item>
            </q-list>
          </div>
        </q-popover>
      </q-btn>
    </div>
    <small class="form-schema-error" v-if="$v.value.$error">{{ errorMessage }}</small>
  </div>
</template>

<script>

import EThing from 'ething-js'
import { FormComponent, registerForm } from './core'


registerForm(schema => {
  if (schema.format === 'host') {
    return 'form-schema-host'
  }
})

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
      loading: true
    }
  },

  methods: {
    showHosts () {
      this.refresh()
    },

    refresh (force) {
      this.loading = true
      refresh(force, (hosts) => {
        this.hosts = hosts
        this.loading = false
      })
    }
  },

  mounted () {

  }

}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
