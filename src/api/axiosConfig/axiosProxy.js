import axios from 'axios';
// axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.baseURL = 'http://u26t8q.natappfree.cc';
axios.defaults.timeout = 1000;
axios.defaults.headers = {
  'Content-Type': 'application/json',
  'Authorization': 'null'
};

axios.defaults.withCredentials = true;
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  if (config.method !== 'get' && config.method !== 'delete') {
    if (config.method === 'post') {
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }
  } else {
    config.headers['Content-Type'] = 'text/plain';
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
