import Select from './Select'
import Radio from './Radio'
import Checkbox from './Checkbox'
import Input from './Input'
import File from './File'
import Password from './Password'
import Textarea from './Textarea'
import Color from './Color'
import Datetime from './Datetime'
import Range from './Datetime'
import ObjectComponent from './Object'
import ArrayComponent from './Array'
import Const from './Const'

// the order is important !
export default [
  // enum & Arrray of enum & boolean
  Select,
  Radio,
  Checkbox,

  // string/number
  File,
  Datetime, // format=date-time
  Color,
  Input,
  Password,
  Textarea,
  Range,

  // array
  ArrayComponent,

  //object,
  ObjectComponent,
  
  Const,

]
