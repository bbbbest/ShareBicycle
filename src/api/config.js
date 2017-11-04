// 这个文件不是配置文件，是对系统参数的一些设定
import axios from './axiosConfig/axiosProxy';

export default {
  /**
   * 这里应该返回的是如下格式
   * {
   *  "status": 200,
   *  "msg": "success",
   *  "data": {
   *    price: 10,
   *    activityReward: 2,
   *    adviceReward: 2
   *  }
   * }
   * @returns {AxiosPromise}
   */
  fetchConfig () {
    return axios.get('/config');
  },
  /**
   * 此方法向服务器发送的类似于表单提交的形式，不需要转为json
   * 这里应该返回的是如下格式的数据
   * {
   *  "status": 200,
   *  "msg": "success",
   *  "data": {
   *  }
   * }
   * @param adminId 管理员ID
   * @param type 更新的值的类型，可取值[price,activityReward,adviceReward]
   * @param value 更新后的值
   * @returns {AxiosPromise}
   */
  updateConfig (adminId, type, value) {
    return axios.put('/config', {adminId: adminId, type: type, value: value});
  }
};
