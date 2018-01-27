import Vue from 'vue';
import Vuex from 'vuex';
import global from './modules/global';
import { install as fetchInstall } from '../fetch';

Vue.use(Vuex);

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules:{
    global
  }
});

/**
 * install fetch
 */
fetchInstall(store);

export default store;
