import axios from './axiosConfig/axiosProxy';
// import qs from 'qs';

export default {
  fetchPagination (current, size) {
    return axios.get('/activities', {
      params: {
        start: current,
        pagesize: size
      }
    });
  },
  fetchTotal () {
    return axios.get('/activities');
  },
  fetchUnProcessTotal () {
    return axios.get('/activities?t=havemsg');
  },
  fetchUnProcess (current, size) {
    return axios.get('/activities?t=requests', {
      params: {
        start: current,
        pagesize: size
      }
    });
  },
  dynamicFetch ({type, prefix}) {
    return axios.get('/activities', {
      params: {
        type: type,
        prefix: prefix
      }
    });
  },
  query ({type, value}) {
    return axios.get('/activities', {
      params: {
        type: type,
        value: value
      }
    });
  },
  update (val) {
    return axios.put('/activities', val);
  },
  create (val) {
    return axios.post('/activities', val);
  },
  deleteItem (id) {
    return axios.delete('/activities', {
      params: {
        id: id
      }
    });
  }
};
