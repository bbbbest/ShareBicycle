import * as types from '../types';
import fetcher from '../../api/fetcher';

const state = {
  allPrivileges: [
    {
      id: '1',
      admin: {
        query: true,
        update: false
      },
      user: {
        query: true,
        update: false
      },
      activity: {
        query: true,
        update: false
      },
      advice: {
        query: true,
        update: false
      },
      bicycle: {
        query: true,
        update: false
      },
      cyclingrecord: {
        query: true,
        update: false
      },
      dealrecord: {
        query: true,
        update: false
      }
    },
    {
      id: '2',
      admin: {
        query: true,
        update: false
      },
      user: {
        query: true,
        update: false
      },
      activity: {
        query: true,
        update: false
      },
      advice: {
        query: true,
        update: false
      },
      bicycle: {
        query: true,
        update: false
      },
      cyclingrecord: {
        query: true,
        update: false
      },
      dealrecord: {
        query: true,
        update: false
      }
    },
    {
      id: '3',
      admin: {
        query: true,
        update: true
      },
      user: {
        query: true,
        update: false
      },
      activity: {
        query: true,
        update: false
      },
      advice: {
        query: true,
        update: true
      },
      bicycle: {
        query: true,
        update: true
      },
      cyclingrecord: {
        query: true,
        update: false
      },
      dealrecord: {
        query: true,
        update: false
      }
    }
  ]
};

const getters = {
  allPrivileges: (state) => state.allPrivileges
};
const actions = {
  [types.FETCH_ALL_PRIVILEGES] ({commit}) {
    return new Promise((resolve, reject) => {
      fetcher.privilege.fetchAllPrivileges()
        .then((response) => {
          if (response.data.status === 200) {
            commit(types.INITIAL_ALL_PRIVILEGES, response.data.data.values);
            resolve();
          } else {
            reject(response.data.message);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
};
const mutations = {
  [types.INITIAL_ALL_PRIVILEGES] (state, allPrivileges) {
    state.allPrivileges = allPrivileges;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
