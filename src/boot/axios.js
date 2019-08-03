import axios from 'axios'

export default ({ Vue }) => {
  Vue.prototype.$axios = axios
  if (window) {
    window.axios = axios
  }
}
