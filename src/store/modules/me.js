import * as types from '../types';
import fetcher from '../../api/fetcher';

const state = {
  me: {
    adminId: '',
    username: '',
    name: '',
    privilegeId: -1,
    privilege: {
      admin: {
        query: false,
        update: false
      },
      user: {
        query: false,
        update: false
      },
      activity: {
        query: false,
        update: false
      },
      advice: {
        query: false,
        update: false
      },
      bicycle: {
        query: false,
        update: false
      },
      cyclingrecord: {
        query: false,
        update: false
      },
      dealrecord: {
        query: false,
        update: false
      }
    }
  }
};
const getters = {
  adminId: (state) => state.me.adminId,
  username: (state) => state.me.username,
  name: (state) => state.me.name,
  adminInfo: (state) => {
    return {
      adminId: state.me.adminId,
      username: state.me.username,
      name: state.me.name,
      privilegeId: state.me.privilegeId
    };
  },
  privilege: (state) => state.privilege,
  queryUser: (state) => state.me.privilege.user.query,
  updateUser: (state) => state.me.privilege.user.update,
  queryActivity: (state) => state.me.privilege.activity.query,
  updateActivity: (state) => state.me.privilege.activity.update,
  queryAdmin: (state) => state.me.privilege.admin.query,
  updateAdmin: (state) => state.me.privilege.admin.update,
  queryAdvice: (state) => state.me.privilege.advice.query,
  updateAdvice: (state) => state.me.privilege.advice.update,
  queryBicycle: (state) => state.me.privilege.bicycle.query,
  updateBicycle: (state) => state.me.privilege.bicycle.update,
  queryCyclingrecord: (state) => state.me.privilege.cyclingrecord.query,
  updateCyclingrecord: (state) => state.me.privilege.cyclingrecord.update,
  queryDealrecord: (state) => state.me.privilege.dealrecord.query,
  updateDealrecord: (state) => state.me.privilege.dealrecord.update
};
const actions = {
  [types.RESET_PASSWORD] ({commit}, {old, n}) {
    return new Promise((resolve, reject) => {
      fetcher.me.resetPWD({old: old, n: n})
        .then((response) => {
          if (response.data.status === 200) {
            resolve();
          } else {
            reject();
          }
        })
        .catch((error) => {
          console.log(error);
          reject();
        });
    });
  },
  [types.FETCH_PRIVILEGE] ({commit, state}) {
    return new Promise((resolve, reject) => {
      fetcher.privilege.fetchAdminPrivilege(state.me.privilegeId)
        .then((response) => {
          if (response.data.status === 200) {
            commit(types.SET_ADMIN_PRIVILEGE, response.data.data.privilege);
            resolve();
          } else {
            reject();
          }
        })
        .catch((error) => {
          console.log(error);
          reject();
        });
    });
  }
};
const mutations = {
  [types.SET_ADMIN_INFO] (state, {adminId, username, name, privilegeId}) {
    state.me.adminId = adminId;
    state.me.username = username;
    state.me.name = name;
    state.me.privilegeId = privilegeId;
  },
  [types.SET_ADMIN_PRIVILEGE] (state, privilege) {
    state.me.privilege = privilege;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
