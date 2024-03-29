/**
 * THIS FILE IS GENERATED AUTOMATICALLY.
 * DO NOT EDIT.
 *
 * You are probably looking on adding initialization code.
 * Use "quasar new plugin <name>" and add it there.
 * One plugin per concern. Then reference the file(s) in quasar.conf.js > plugins:
 * plugins: ['file', ...] // do not add ".js" extension to it.
 **/

import 'quasar-framework/dist/quasar.ie.polyfills.js'



import 'quasar-extras/roboto-font/roboto-font.css'

import 'quasar-extras/material-icons/material-icons.css'




import 'quasar-app-styl'


import 'src/css/app.styl'


import Vue from 'vue'
import createApp from './app.js'




import pI18n from 'src/plugins/i18n'

import pAxios from 'src/plugins/axios'











Vue.config.devtools = true
Vue.config.performance = true
Vue.config.productionTip = false


console.info('[Quasar] Running SPA with MAT theme.')



const { app, router } = createApp()




;[pI18n,pAxios].forEach(plugin => {
  plugin({
    app,
    router,
    
    Vue,
    ssrContext: null
  })
})









new Vue(app)






