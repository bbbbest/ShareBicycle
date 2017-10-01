import axios from './axiosConfig/axiosProxy';
import qs from 'qs';

export default {
  check ({username, password}) {
    return axios.post('/login', qs.stringify({
      username: username,
      password: password
    }));
  },
  resetPWD ({old, n}) {
    return axios.post('/pwd', qs.stringify({old: old, n: n}));
  },
  fetchUnProcessFlag () {
    let u = false;
    let f = false;
    let a = false;
    axios.get('/users?havemsg').then((response) => {
      if (response.data.data.total > 0) {
        u = true;
      }
    });
    axios.get('/activities?havemsg').then((response) => {
      if (response.data.data.total > 0) {
        a = true;
      }
    });
    axios.get('/feedback?havemsg').then((response) => {
      if (response.data.data.total > 0) {
        f = true;
      }
    });

    return new Promise((resolve, reject) => {
      resolve({u: u, f: f, a: a});
    });
  }
};
