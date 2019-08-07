import EThingUI from "../core";
import VueZoomer from 'vue-zoomer'
import 'vue-zoomer/dist/vue-zoomer.css'



export default (args) => {
  console.log(args)
  EThingUI.install(args)

  // third parties
  args.Vue.use(VueZoomer)
}
