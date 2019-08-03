

export default ({EThingUI, Vue}) => {


    const eventBus = new Vue();

    Object.assign(EThingUI, {

        /*
        eventEmitter
        */
        on () {
          return eventBus.$on.apply(eventBus, arguments)
        },
        once () {
          return eventBus.$once.apply(eventBus, arguments)
        },
        off () {
          return eventBus.$off.apply(eventBus, arguments)
        },
        emit () {
          return eventBus.$emit.apply(eventBus, arguments)
        },

    })

}
