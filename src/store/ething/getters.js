/*
export const someGetter = (state) => {}
 */

export const filter = (state) => (filter) => {
  return state.resources.filter(filter)
}

export const get = (state) => (id) => {
  return state.resources.find(r => r.id() === id)
}

export const glob = (state) => (path) => {
  var globRe = new RegExp('^' + (path ? (path + '/') : '') + '[^/]+$')
  return state.resources.filter(r => globRe.test(r.name()))
}
