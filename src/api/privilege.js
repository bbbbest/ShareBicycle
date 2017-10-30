import axios from './axiosConfig/axiosProxy';
import qs from 'qs';

export default {
  fetchTotal () {
    return axios.get('/privileges?t=total');
  },
  fetchAllPrivileges () {
    return axios.get('/privileges?t=all');
  },
  fetchAllAdminPrivileges () {
    return axios.get('/privileges?t=admins');
  },
  fetchAdminPrivilege (id) {
    return axios.get('/privileges?t=id&id=' + id);
  },
  add (val) {
    return axios.post('/admins', qs.stringify(val));
  },
  del (val) {
    return axios.delete('/admins?id=' + val);
  },
  update (val) {
    return axios.put('/admins', val);
  }
};
