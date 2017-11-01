import axios from './axiosConfig/axiosProxy';

export default {
  fetchPagination (current, size) {
    return axios.get('/bikes', {
      params: {
        start: current,
        pagesize: size
      }
    });
  },
  fetchTotal () {
    return axios.get('/bikes');
  },
  dynamicFetch ({type, prefix}) {
    return axios.get('/bikes', {
      params: {
        type: type,
        prefix: prefix
      }
    });
  },
  query ({type, value}) {
    return axios.get('/bikes', {
      params: {
        type: type,
        value: value
      }
    });
  },
  add (val) {
    return axios.post('/bikes', val);
  },
  del (val) {
    return axios.delete('/bikes', {
      params: {
        id: val
      }
    });
  },
  update ({id, lockId, status}) {
    return axios.put('/bikes', {
      params: {id: id, lockId: lockId, status: status}
    });
  }
};
