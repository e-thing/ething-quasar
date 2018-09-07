import axios from 'axios'

export default ({ Vue }) => {
  Vue.prototype.$axios = axios
  window.axios = axios
}
