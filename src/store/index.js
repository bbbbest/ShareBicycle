import Vue from 'vue';
import Vuex from 'vuex';
import {actions} from './actions';
import {getters} from './getters';
import {mutations} from './mutations';
import bikes from './modules/bikes';
import users from './modules/users';
import feedback from './modules/feedback';
import activities from './modules/activities';
import privileges from './modules/privileges';
import me from './modules/me';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

const state = {
  // 判断登录状态
  islogin: false,
  token: '',
  have: {
    userMSG: true,
    feedbackMSG: true,
    activityMSG: false
  }
};

export default new Vuex.Store({
  state,
  actions,
  getters,
  mutations,
  modules: {
    bikes,
    users,
    feedback,
    activities,
    privileges,
    me
  },
  plugins: [createPersistedState({ storage: window.sessionStorage })],
  strict: process.env.NODE_ENV !== 'production'
});
