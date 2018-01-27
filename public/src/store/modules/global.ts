import Vue from 'vue';
import {
  MutationTree,
  ActionTree,
  ActionContext,
  Module,
  GetterTree
} from 'vuex';

/**
 * Interfaces
 */
interface IFetchState {
  type: 'success' | 'error';
  message: string;
}

interface ICommonState {
  fetchState: IFetchState | null;
}

/**
 * State
 */
const states: ICommonState = {
  fetchState: null
};

/**
 * Mutations
 */
const FETCH_NOTIFY = 'FETCH_NOTIFY';

const mutations: MutationTree<ICommonState> = {
  [FETCH_NOTIFY](state: any, payload: any) {
    state.fetchState = payload;
  }
};

const Module: Module<ICommonState, any> = {
  namespaced: true,
  state: states,
  mutations
};

export default Module;

