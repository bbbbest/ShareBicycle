import axios from './axiosConfig/axiosProxy';

export default {
  fetchPagination (uid, begin, pageSize) {
    return axios.get('/dealrecord', {
      params: {
        userid: uid,
        start: begin,
        pagesize: pageSize
      }
    });
  }
};
