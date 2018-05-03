import { req, withParams } from 'vuelidate/lib/validators/common'

export var regex = (pattern) =>
  withParams({type: 'regex', pattern}, value =>
    !req(value) || (new RegExp(pattern)).test(value))
