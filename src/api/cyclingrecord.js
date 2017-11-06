import axios from './axiosConfig/axiosProxy';

export default {
  fetchPagination (uid, begin, pageSize) {
    return axios.get('/cyclingrecord', {
      params: {
        userId: uid,
        start: begin,
        pagesize: pageSize
      }
    });
  }
};
