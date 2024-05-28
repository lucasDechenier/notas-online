import '@fortawesome/fontawesome-free/css/all.css' 
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { aliases, fa } from 'vuetify/iconsets/fa'

import { pt, en, es } from 'vuetify/locale'

const vuetify = createVuetify({
  icons: {
    defaultSet: 'fa',
    aliases,
    sets: {
      fa,
    }
  },
  locale: {
    locale: 'pt',
    fallback: 'en',
    messages: { pt, en, es }
  },
  components,
  directives,
})

export default vuetify;