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
  activities: utils.deepCopy(initial)
};
const getters = {
  activitiesPagination: (state) => state.activities.pagination
};
const actions = {
  [types.FETCHER_ACTIVITY_TOTAL] ({commit}) {
    return new Promise((resolve, reject) => {
      fetcher.activities.fetchTotal()
        .then((response) => {
          if (response.data.status === 200) {
            commit(types.SET_ACTIVITIES_PAGINATION_TOTAL, {total: response.data.data.total});
            resolve();
          }
        });
    });
  },
  [types.FETCHER_ACTIVITY_UNPROCESS_TOTAL] ({commit}) {
    return new Promise((resolve, reject) => {
      fetcher.activities.fetchUnProcessTotal()
        .then((response) => {
          if (response.data.status === 200) {
            commit(types.SET_ACTIVITIES_PAGINATION_TOTAL, {total: response.data.data.total});
            resolve();
          }
        });
    });
  }
};
const mutations = {
  [types.SET_ACTIVITIES_PAGINATION_TOTAL] (state, {total}) {
    state.activities.pagination.total = total;
  },
  [types.SET_ACTIVITIES_PAGINATION_PAGE_SIZE] (state, {pageSize}) {
    state.activities.pagination.pageSize = pageSize;
  },
  [types.SET_ACTIVITIES_PAGINATION_CURRENT] (state, {current}) {
    state.activities.pagination.currentPage = current;
  },
  [types.SET_ACTIVITIES_LAST_UPDATED] (state, last) {
    state.activities.lastUpdated = last;
  },
  [types.SET_ACTIVITIES_SHOULD_UPDATED] (state, should) {
    state.activities.shouldUpdate = should;
  },
  [types.DESTROY_ACTIVITIES_ALL] (state) {
    state.activities = utils.deepCopy(initial);
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
