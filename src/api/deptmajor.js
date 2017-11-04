// 院系-专业 二级联动
import axios from './axiosConfig/axiosProxy';

export default {
  fetchDepartments () {
    return axios.get('/depts');
  },
  fetchMajors (deptId) {
    return axios.get('/majors', {
      params: {
        deptId: deptId
      }
    });
  }
};
