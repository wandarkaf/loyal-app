import './assets/main.css'
import '@mdi/font/css/materialdesignicons.css'

import { createApp } from 'vue'

import { createPinia } from 'pinia'
import { PiniaHistoryPlugin } from '@/plugins/PiniaHistoryPlugin'

import VueGoogleMaps from '@fawmi/vue-google-maps'

import App from './App.vue'
import router from './router'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    themes: {
      light: {
        colors: {
          primary: '#1867C0',
          secondary: '#5CBBF6'
        }
      }
    }
  }
})

// Webfontloader
export async function loadFonts() {
  const webFontLoader = await import(/* webpackChunkName: "webfontloader" */ 'webfontloader')

  webFontLoader.load({
    google: {
      families: ['Roboto:100,300,400,500,700,900&display=swap']
    }
  })
}

loadFonts()

// pinia
const pinia = createPinia()
pinia.use(PiniaHistoryPlugin)

// init app
const app = createApp(App)
app.use(vuetify)
app.use(router)
app.use(pinia)
app.use(VueGoogleMaps, {
  load: {
    key: import.meta.env.VITE_FIREBASE_API_KEY
  }
})

app.mount('#app')
