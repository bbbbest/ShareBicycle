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
    return new Promise((resolve, reject) => {
      axios.all([
        axios.get('/users?t=havemsg'),
        axios.get('/activities?t=havemsg'),
        axios.get('/feedback?t=havemsg')
      ]).then(axios.spread((d1, d2, d3) => {
        resolve({u: d1.data.data.total > 0, a: d2.data.data.total > 0, f: d3.data.data.total > 0});
      }));
    });
  }
};
