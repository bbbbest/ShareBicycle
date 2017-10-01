import axios from './axiosConfig/axiosProxy';

export default {
  fetchTotal () {
    return axios.get('/privileges?t=total');
  },
  fetchAllPrivileges () {
    return axios.get('/privileges?t=all');
  },
  fetchAllAdminPrivileges () {
    return axios.get('/privileges?t=admin');
  },
  fetchAdminPrivilege (id) {
    return axios.get('/privileges?t=id&id=' + id);
  },
  add (val) {
    return axios.post('/privileges?t=add', val);
  },
  update (id, val) {
    return axios.put('/privileges?t=update', val);
  }
};
