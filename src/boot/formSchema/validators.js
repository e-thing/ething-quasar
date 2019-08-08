import { req, len, withParams } from 'vuelidate/lib/validators/common'

export var regex = (pattern) =>
  withParams({type: 'regex', pattern}, value =>
    !req(value) || (new RegExp(pattern)).test(value))

export var minLengthStrict = (length) =>
  withParams(
    { type: 'minLength', min: length },
    (value) => {
      var l;
      if (!value) l = 0
      else l = len(value)
      return l >= length
    }
  )

/*
export var required = () => {
  return withParams({ type: 'required' }, (value) => {
    console.log('test req', value, 'result', req(value))
    return req(value)
  })
}

export var minLength = (length) =>
  withParams(
    { type: 'minLength', min: length },
    (value) => {
      console.log('test minLength', value, 'req', req(value), 'len', len(value), 'minlen', length)
      return !req(value) || len(value) >= length
    }
  )
*/
