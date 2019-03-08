import ModalComponent from '../components/ResourceCreateModal'

export default {
  install ({ EThingUI, Vue }) {

    EThingUI.createModal = function(props) {
      return new Promise((resolve, reject) => {
        const node = document.createElement('div')
        document.body.appendChild(node)

        const
          ok = data => {
            console.log('ok')
            resolve(data)
            vm.$destroy()
          },
          cancel = reason => {
            console.log('cancel', reason)
            reject(reason || new Error())
            vm.$destroy()
          }

        const vm = new Vue({
          el: node,
          data () {
            return { props }
          },
          render: h => h(ModalComponent, {
            ref: 'modal',
            props,
            on: {
              ok,
              cancel
            }
          }),
          mounted () {
            this.$refs.modal.show()
          }
        })
      })

    }
  }
}
