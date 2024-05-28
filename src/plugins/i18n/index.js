import { createI18n } from 'vue-i18n'

import enUs from '@/locales/en_US.js'
import ptBr from '@/locales/pt_BR.js'
import esES from '@/locales/es_ES.js'


const messages = { 
  'pt_BR': ptBr, 
  'en_US': enUs,
  'es_ES': esES
}


const i18n = createI18n({
  locale: 'pt_BR',
  fallbackLocale: 'en_US',
  messages
})

export default i18n