// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';
import './assets/global/css/ionicons.min.css';
import App from './App';
import store from './store';
import router from './router';
import VCharts from 'v-charts';
import axios from './api/axiosConfig/axiosProxy';
import VueProgressBar from 'vue-progressbar';

Vue.prototype.$axios = axios;
const options = {
  color: '#13CE66',
  failedColor: '#FF4949',
  thickness: '3px',
  transition: {
    speed: '0.2s',
    opacity: '0.8s',
    termination: 300
  },
  autoRevert: true,
  location: 'top',
  inverse: false
};
Vue.use(VueProgressBar, options);
Vue.use(VCharts);
Vue.use(ElementUI);
Vue.config.productionTip = false;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
});

router.beforeEach((to, from, next) => {
  // TODO
  const islogin = store.state.islogin; // 假设没有登录（这里应从接口获取）
  if (to.meta.requiresAuth && !islogin) { // 需要登录授权，这里还需要判断是否登录
    next('/login'); // 跳转到登录
    return;
  }
  next();
});
