import EThing from 'ething-js'


export default {
  install ({ EThingUI }) {
    
    function typeFilter (types) {

      // blank separated list of types
      var whiteList = [], blackList = [];

      types.split(' ').forEach(type => {
        if (!type) return
        if (type[0] === '!') blackList.push(type.replace('!', ''))
        else whiteList.push(type)
      })

      return r => {
        var pass = false;
        for (var i in whiteList) {
          if (EThingUI.isSubclass(r, whiteList[i])) {
            pass = true
            break
          }
        }
        if (pass) {
          for (var i in blackList) {
            if (EThingUI.isSubclass(r, blackList[i])) {
              pass = false
              break
            }
          }
        }
        return pass
      }
    }

    Object.assign(EThingUI, {
      resource: {
        typeFilter
      }
    })
  }
}
