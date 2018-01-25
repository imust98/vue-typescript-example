import Vue from 'vue';
import VueRouter, { Route } from 'vue-router';
import routes from './routes';

Vue.use(VueRouter);

const router: VueRouter = new VueRouter({
  mode: 'history',
  routes
});

export default router;