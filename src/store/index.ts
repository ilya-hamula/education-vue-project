import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    username: null
  },
  mutations: {
    setUserName(state, username) {
      state.username = username;
    }
  },
  actions: {},
  getters: {
    username(state) {
      return state.username;
    }
  },
  modules: {}
});
