import * as types from '../types';
import utils from '../utils';
import fetcher from '../../api/fetcher';

const initial = {
  lastUpdated: 0,
  shouldUpdate: true,
  pagination: {
    total: 0,
    pageSizes: [20, 30, 40],
    pageSize: 20,
    currentPage: 1
  }
};
const state = {
  bikes: utils.deepCopy(initial)
};
const getters = {
  bikesPagination: (state) => state.bikes.pagination
};
const actions = {
  [types.FETCHER_BIKES_TOTAL] ({commit}) {
    return new Promise((resolve, reject) => {
      fetcher.bikes.fetchTotal()
        .then((response) => {
          if (response.data.status === 200) {
            commit(types.SET_BIKES_PAGINATION_TOTAL, {total: response.data.data.total});
            resolve();
          }
        });
    });
  }
};
const mutations = {
  [types.SET_BIKES_PAGINATION_TOTAL] (state, {total}) {
    state.bikes.pagination.total = total;
  },
  [types.SET_BIKES_PAGINATION_PAGE_SIZE] (state, {pageSize}) {
    state.bikes.pagination.pageSize = pageSize;
  },
  [types.SET_BIKES_PAGINATION_CURRENT] (state, {current}) {
    state.bikes.pagination.currentPage = current;
  },
  [types.SET_BIKES_LAST_UPDATED] (state, last) {
    state.bikes.lastUpdated = last;
  },
  [types.SET_BIKES_SHOULD_UPDATED] (state, should) {
    state.bikes.shouldUpdate = should;
  },
  [types.DESTROY_BIKES_ALL] (state) {
    state.bikes = utils.deepCopy(initial);
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
