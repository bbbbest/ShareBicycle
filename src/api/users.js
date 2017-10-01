import axios from './axiosConfig/axiosProxy';
// import qs from 'qs';

export default {
  fetchPagination (current, size) {
    return axios.get('/users', {
      params: {
        start: current,
        pagesize: size
      }
    });
  },
  fetchTotal () {
    return axios.get('/users');
  },
  fetchUnProcessTotal () {
    return axios.get('/users?t=havemsg');
  },
  fetchUnProcess (current, size) {
    return axios.get('/users?t=requests', {
      params: {
        start: current,
        pagesize: size
      }
    });
  },
  dynamicFetch ({type, prefix}) {
    return axios.get('/users', {
      params: {
        type: type,
        prefix: prefix
      }
    });
  },
  query ({type, value}) {
    return axios.get('/users', {
      params: {
        type: type,
        value: value
      }
    });
  },
  add (val) {
    return axios.post('/users', val);
  },
  del (id) {
    return axios.delete('/users', {
      params: {
        id: id
      }
    });
  },
  update (val) {
    return axios.put('/users', val);
  }
};
