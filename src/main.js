import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import * as VueGoogleMaps from 'vue2-google-maps';

Vue.use(VueGoogleMaps, {
  load: {
    key: process.env.VUE_APP_GOOGLE_MAP_API_KEY,
    libraries: 'places', // This is required if you use the Autocomplete plugin
  }
})

Vue.component('google-map', VueGoogleMaps.Map);

new Vue({
  render: h => h(App),
}).$mount('#app')
