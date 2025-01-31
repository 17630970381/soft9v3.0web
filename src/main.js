import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import echarts from "echarts"
import 'element-ui/lib/theme-chalk/index.css';
import axios from "axios";
import {getRequest} from "@/api/user";
Vue.prototype.$echarts=echarts;
Vue.config.productionTip = false
Vue.prototype.$axios = axios;

Vue.use(ElementUI)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
