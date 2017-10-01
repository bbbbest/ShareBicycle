import axios from './axiosConfig/axiosProxy';
// import qs from 'qs';

export default {
  fetchPagination (current, size) {
    return axios.get('/feedback', {
      params: {
        start: current,
        pagesize: size
      }
    });
  },
  fetchTotal () {
    return axios.get('/feedback');
  },
  fetchUnProcessTotal () {
    return axios.get('/feedback?t=havemsg');
  },
  fetchUnProcess (current, size) {
    return axios.get('/feedback?t=requests', {
      params: {
        start: current,
        pagesize: size
      }
    });
  },
  dynamicFetch ({type, prefix}) {
    return axios.get('/feedback', {
      params: {
        type: type,
        prefix: prefix
      }
    });
  },
  query ({type, value}) {
    return axios.get('/feedback', {
      params: {
        type: type,
        value: value
      }
    });
  },
  update (val) {
    return axios.put('/feedback', val);
  }
};
