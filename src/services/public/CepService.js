import api from '@/services/Api'

export default {

  getCep(cep){
    return api.get(`http://viacep.com.br/ws/${cep}/json/`).then(resp => resp.data)
  }
}