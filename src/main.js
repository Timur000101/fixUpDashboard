import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import axios from 'axios'
import VueAxios from 'vue-axios'
import moment from 'moment'
import filters from './filters/index.js'
import vuePicturePreview from 'vue-picture-preview';
import Chartkick from 'vue-chartkick'
import Chart from 'chart.js'

Vue.use(Chartkick.use(Chart))
Vue.prototype.moment = moment
window.axios = require('axios');
Vue.use(VueAxios, axios)
Vue.use(vuetify)
Vue.use(vuePicturePreview)

Vue.config.productionTip = false


new Vue({
  router,
  store,
  vuetify,
  filters,
  render: h => h(App)
}).$mount('#app')
