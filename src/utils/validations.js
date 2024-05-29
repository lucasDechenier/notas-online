import { isNil, isEmpty } from 'lodash'

function required(v) {

  return isNil(v) || isEmpty(v.toString()) ? 'Campo obrigatório' : true
}
export { required }
