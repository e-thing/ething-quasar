
import {merge,defaultMerge,arrayUniqueMerge,mapMerge} from './merging'


var mergeStrategies = {
  required: arrayUniqueMerge,
  properties: mapMerge,
}


export function extend (parent, child) {
  return merge(parent, child, mergeStrategies, defaultMerge)
}
