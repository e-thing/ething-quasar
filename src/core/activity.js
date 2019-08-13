import EThing from 'ething-js'

const blackList = [
  'signals/ResourceUpdated'
]

const activityHistoryLength = 50

export default ({EThingUI, Vue}) => {

  var activityData;

  function initData () {
    activityData = EThingUI.activity = {
      'global': []
    }
    return activityData
  }

  initData ()

  function eventHandler (evt, extra) {
    var type = evt.type

    if (!evt.originalEvent) return // skip internal event
    console.log(type)
    if (blackList.indexOf(type) !== -1) return // skip

    if (evt.originalEvent.resource) {
      var rid = evt.originalEvent.resource.id
      var resource = EThing.arbo.get(rid)
      if (resource) {
        if (!activityData[rid]) {
          activityData[rid] = []
        }

        var list = activityData[rid]

        activityData[rid].push(evt)

        if (activityHistoryLength>0) {
          activityData[rid] = activityData[rid].slice(Math.max(activityData[rid].length - activityHistoryLength, 0))
        }

      }
    }
  }

  EThing.on('*', eventHandler)
  EThingUI.on('ui.loaded', () => {
    initData ()
  })

}
