import EThing from 'ething-js'

const blackList = [
  'signals/ResourceUpdated'
]

const activityHistoryLength = 50

export default ({EThingUI, app, Vue}) => {

  var activityData;

  function initData () {
    activityData = app.data.activityData = EThingUI.activity = {
      'global': []
    }

    return activityData
  }

  initData ()

  function eventHandler (evt, extra) {
    var type = evt.type

    if (!evt.originalEvent) return // skip internal event
    if (blackList.indexOf(type) !== -1) return // skip

    var aid = null;

    if (evt.resource) {
      aid = evt.resource.id()
    } else if (evt.plugin) {
      aid = evt.plugin.type()
    } else {
      aid = "global"
    }

    if (!activityData[aid]) {
      Vue.set(activityData, aid, [])
      //activityData[aid] = []
    }

    activityData[aid].push(evt)

    if (activityHistoryLength>0) {
      activityData[aid] = activityData[aid].slice(Math.max(activityData[aid].length - activityHistoryLength, 0))
    }
  }

  EThing.on('*', eventHandler)
  EThingUI.on('ui.loaded', () => {
    initData ()
  })

}
