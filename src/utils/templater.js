
import { date, format } from 'quasar'


var item_re = /%[^\s]+%/g;


export function parse (template, obj) {

  var match, matches = [], str = template;

  while (match = item_re.exec(template)) {
    matches.push(match)
  }

  matches.reverse().forEach(match => {
    var matchIndex = match.index
    var matchLength = match[0].length
    var propName = match[0].substring(1, matchLength-1)

    var res = undefined

    try {
      if (typeof obj === 'function') {
        res = obj(propName)
      } else {
        var objPtr = obj[propName];

        if (typeof objPtr === 'function') {
          res = objPtr.call(obj)
        } else {
          res = objPtr
        }
      }
    } catch(error) {}

    if (res instanceof Date) {
      res = date.formatDate(res.getTime(), 'YYYY-MM-DD HH:mm:ss')
    }

    str = str.substring(0, matchIndex) +
           String(res) +
           str.substring(matchIndex + matchLength, str.length);
  })


  return str
}
