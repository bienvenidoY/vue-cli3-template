import Vue from 'vue'
import App from './App.vue'
const isPord = process.env.NODE_ENV === 'production'
if(isPord) {
  Vue.config.productionTip = false
  Vue.config.devtools = false
}

console.log(process.env)

new Vue({
  render: h => h(App)
}).$mount('#app')
