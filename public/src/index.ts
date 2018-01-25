import Vue from 'vue';
import router from './router';
import store from './store';
import App from './views/App.vue';

// tslint:disable-next-line
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
