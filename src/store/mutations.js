import * as types from './types';

export const mutations = {
  [types.SET_IS_LOGIN] (state, value) {
    state.islogin = value;
  },
  [types.SET_TOKEN] (state, token) {
    state.token = token;
  },
  [types.DESTROY_TOKEN] (state) {
    state.token = '';
  },
  [types.RESET_QUICK_USER] (state) {
    state.have.userMSG = false;
  },
  [types.RESET_QUICK_ACTIVITY] (state) {
    state.have.activityMSG = false;
  },
  [types.RESET_QUICK_FEEDBACK] (state) {
    state.have.feedbackMSG = false;
  },
  [types.SET_UNPROCESS_FLAG] (state, res) {
    // todo
    state.have.userMSG = res.u;
    state.have.activityMSG = res.f;
    state.have.feedbackMSG = res.a;
  }
};
