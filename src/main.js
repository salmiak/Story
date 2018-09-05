import Vue from 'vue'
import VueResource from 'vue-resource'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

Vue.use(VueResource)
// Vue.http.options.root = 'http://localhost:8081'
var hostArr = window.location.href.split('/')
Vue.http.options.root = hostArr[0] + "//" + hostArr[2]

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
