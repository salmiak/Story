import Vue from 'vue'
import VueResource from 'vue-resource'
import App from './App.vue'
import router from './router'
import VueMasonry from 'vue-masonry-css'

Vue.use(VueMasonry)

Vue.config.productionTip = false

Vue.use(VueResource)
// Vue.http.options.root = 'http://localhost:8081'
var hostArr = window.location.href.split('/')
Vue.http.options.root = hostArr[0] + '//' + hostArr[2]
if (process.env.NODE_ENV === 'development') {
  Vue.http.options.root = 'http://localhost:8081'
}

Vue.filter('formatDate', (value) => {
  if (value) {
    return (new Date(String(value))).toLocaleDateString('sv-SE', { year: 'numeric', month: 'short', day: 'numeric' })
  }
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
