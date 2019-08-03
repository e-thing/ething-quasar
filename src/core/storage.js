import { LocalStorage, SessionStorage } from 'quasar'


export default ({EThingUI, Vue}) => {

    Object.assign(EThingUI, {

        /*
        web storage
        */
        dbSet (key, value, storage) {
          var _storage = storage==='session' ? SessionStorage : LocalStorage
          _storage.set(key, value)
        },
        dbGet (key, storage) {
          var _storage = storage==='session' ? SessionStorage : LocalStorage

          if (key instanceof RegExp) {
            var _all = _storage.get.all()
            var _res = {}
            for(var k in _all) {
              if (key.test(k)) {
                _res[k] = _all[k]
              }
            }
            return _res
          } else if (typeof key === 'string'){
            return _storage.get.item(key)
          } else {
            return _storage.get.all()
          }
        },
        dbDelete (key, storage) {
          var _storage = storage==='session' ? SessionStorage : LocalStorage
          _storage.remove(key)
        }


    })

}
