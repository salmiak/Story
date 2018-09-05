import Vue from 'vue'
import VueResource from 'vue-resource'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

Vue.use(VueResource)
// Vue.http.options.root = 'http://localhost:8081'
Vue.http.options.root = 'http://' + window.location.hostname + ':8081'

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
