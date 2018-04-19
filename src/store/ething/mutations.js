/*
export const someMutation = (state) => {}
 */

import EThing from 'ething-js'

export const update = (state) => {
  console.log('store resource update')
  state.loaded = true
  state.resources = EThing.arbo.list()
}
