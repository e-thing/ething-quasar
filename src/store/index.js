import Vue from 'vue'
import Vuex from 'vuex'

import ething from './ething'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    ething
  }
})

export default store
