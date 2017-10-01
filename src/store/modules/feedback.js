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
  feedback: utils.deepCopy(initial)
};
const getters = {
  feedbackPagination: (state) => state.feedback.pagination
};
const actions = {
  [types.FETCHER_FEEDBACK_TOTAL] ({commit}) {
    return new Promise((resolve, reject) => {
      fetcher.feedback.fetchTotal()
        .then((response) => {
          if (response.data.status === 200) {
            commit(types.SET_FEEDBACK_PAGINATION_TOTAL, {total: response.data.data.total});
            resolve();
          }
        });
    });
  },
  [types.FETCHER_FEEDBACK_UNPROCESS_TOTAL] ({commit}) {
    return new Promise((resolve, reject) => {
      fetcher.feedback.fetchUnProcessTotal()
        .then((response) => {
          if (response.data.status === 200) {
            commit(types.SET_FEEDBACK_PAGINATION_TOTAL, {total: response.data.data.total});
            resolve();
          }
        });
    });
  }
};
const mutations = {
  [types.SET_FEEDBACK_PAGINATION_TOTAL] (state, {total}) {
    state.feedback.pagination.total = total;
  },
  [types.SET_FEEDBACK_PAGINATION_PAGE_SIZE] (state, {pageSize}) {
    state.feedback.pagination.pageSize = pageSize;
  },
  [types.SET_FEEDBACK_PAGINATION_CURRENT] (state, {current}) {
    state.feedback.pagination.currentPage = current;
  },
  [types.SET_FEEDBACK_LAST_UPDATED] (state, last) {
    state.feedback.lastUpdated = last;
  },
  [types.SET_FEEDBACK_SHOULD_UPDATED] (state, should) {
    state.feedback.shouldUpdate = should;
  },
  [types.DESTROY_FEEDBACK_ALL] (state) {
    state.feedback = utils.deepCopy(initial);
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
