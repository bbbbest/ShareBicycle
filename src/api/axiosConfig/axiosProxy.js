import axios from 'axios';
// axios.defaults.baseURL = 'http://u26t8q.natappfree.cc'; // 杜盛飞
axios.defaults.baseURL = 'http://localhost:8080';
// axios.defaults.baseURL = 'http://9eeq2i.natappfree.cc';
axios.defaults.timeout = 5000;
axios.defaults.withCredentials = true;
axios.defaults.headers = {
  'Content-Type': 'application/json;charset=UTF-8;',
  'Authorization': 'null'
};
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  if (config.method === 'post') {
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8;';
  } else if (config.method === 'get' || config.method === 'delete') {
    config.headers['Content-Type'] = 'text/plain;charset=UTF-8;';
  }
  return config;
}, function (error) {
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  return Promise.reject(error);
});

export default axios;
