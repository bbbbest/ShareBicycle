import * as types from '../types';
import utils from '../utils';
import fetcher from '../../api/fetcher';

const initial = {
  lastUpdated: 0,
  shouldUpdate: true,
  pagination: {
    total: 1000,
    pageSizes: [20, 30, 40],
    pageSize: 20,
    currentPage: 1
  }
};
const state = {
  users: utils.deepCopy(initial)
};
const getters = {
  usersPagination: (state) => state.users.pagination
};
const actions = {
  [types.FETCHER_USERS_TOTAL] ({commit}) {
    return new Promise((resolve, reject) => {
      fetcher.users.fetchTotal()
        .then((response) => {
          if (response.data.status === 200) {
            commit(types.SET_USERS_PAGINATION_TOTAL, {total: response.data.data.total});
            resolve();
          }
        });
    });
  },
  [types.FETCHER_USERS_UNPROCESS_TOTAL] ({commit}) {
    return new Promise((resolve, reject) => {
      fetcher.users.fetchUnProcessTotal()
        .then((response) => {
          if (response.data.status === 200) {
            commit(types.SET_USERS_PAGINATION_TOTAL, {total: response.data.data.total});
            resolve();
          }
        });
    });
  }
};
const mutations = {
  [types.SET_USERS_PAGINATION_TOTAL] (state, {total}) {
    state.users.pagination.total = total;
  },
  [types.SET_USERS_PAGINATION_PAGE_SIZE] (state, {pageSize}) {
    state.users.pagination.pageSize = pageSize;
  },
  [types.SET_USERS_PAGINATION_CURRENT] (state, {current}) {
    state.users.pagination.currentPage = current;
  },
  [types.SET_USERS_LAST_UPDATED] (state, last) {
    state.users.lastUpdated = last;
  },
  [types.SET_USERS_SHOULD_UPDATED] (state, should) {
    state.users.shouldUpdate = should;
  },
  [types.DESTROY_USERS_ALL] (state) {
    state.users = utils.deepCopy(initial);
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
