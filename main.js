import './public/style.css'
import { KLL } from '@kll_/core'
import {
  CreateComponentPlugin,
  ManageAttrsPlugin,
  SmartRenderPlugin,
} from '@kll_/basic'
import { TranslatePlugin } from '@kll_/translate'
import { translation } from './data/translation.js'
import { lsKEY } from './ctrl/rupteur.js'

// PERSIST DATAS  ========================
export const defaultLang = window.navigator.language.split('-')[0]
export const translateLsKey = '__kllbalelfish__lang'
export const defaultLangWordKey = '__kllbalelfish__defaultLangWord'
export const cookieConsentKey = '__kllbalelfish__cookieConsent'

if (localStorage.getItem(cookieConsentKey) === 'consent')
  localStorage.setItem(translateLsKey, defaultLang)

const params = {
  id: 'app',
  routes: {
    '/': import('./pages/index.html?raw').then((m) => m.default),
    '/consent': import('./pages/consent.html?raw').then((m) => m.default),
    '/sync': import('./pages/sync.html?raw').then((m) => m.default),
    '/docs': import('./pages/docs.html?raw').then((m) => m.default),
    '/doc/:id': import('./pages/index.html?raw').then((m) => m.default),
    '/words': import('./pages/words.html?raw').then((m) => m.default),
    '/legal': import('./pages/legal.html?raw').then((m) => m.default),
  },
  plugins: [
    CreateComponentPlugin,
    SmartRenderPlugin,
    ManageAttrsPlugin,
    (kll) => new TranslatePlugin(kll, translation, translateLsKey),
  ],
}

if (import.meta.env.MODE === 'development') {
  params.ctrlPath = import('./ctrl/index.js').then((m) => m)
  params.templatePath = import('./templates/index.js').then((m) => m)
} else {
  params.ctrlPath = import('/ctrl/index.js').then((m) => m)
  params.templatePath = import('/templates/index.js').then((m) => m)
}

export const kll = new KLL(params)

addEventListener('DOMContentLoaded', async () => {
  kll.plugins.translate()
  if (localStorage.getItem(cookieConsentKey) !== 'consent') {
    window.history.pushState({}, '', '/consent')
    kll.injectPage('/consent')
  }
})

// Register service worker -----------------------------------------------------
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').then(
      (registration) => {
        console.log(
          'ServiceWorker registration successful with scope: ',
          registration.scope
        )
      },
      (err) => {
        console.log('ServiceWorker registration failed: ', err)
      }
    )
  })
}

//console.log('VERSION:', pkg?.version)

// Prevent the flash of the dark theme
const theme = localStorage.getItem(lsKEY) || 'dark'
if (theme === 'dark') {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.add('light')
}
