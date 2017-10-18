import * as types from './types';
import fetcher from '../api/fetcher';
import axios from 'axios';

export const actions = {
  [types.DO_LOGIN] ({commit, dispatch}, {username, password}) {
    return new Promise((resolve, reject) => {
      fetcher.me.check({username: username, password: password})
        .then((response) => {
          let data = response.data;
          if (data.status === 200) {
            // set token
            axios.defaults.headers['Authorization'] = data.data.jwt;
            commit(types.SET_TOKEN, data.data.jwt);
            // 设置登陆标志
            commit(types.SET_IS_LOGIN, true);
            // 设置个人信息
            commit(types.SET_ADMIN_INFO, data.data.user);
            // 抓取并初始化权限表
            dispatch(types.FETCH_ALL_PRIVILEGES);
            // 初始化个人权限
            dispatch(types.FETCH_PRIVILEGE);
            // 查询待完成消息
            dispatch(types.FETCHER_UN_PROCESS_FLAG);
            // 成功-回调
            resolve();
          } else {
            // 失败-回调，指成功连接但是后端确认失败
            reject();
          }
        })
        .catch((error) => {
          // 失败-回调，指未成功连接
          console.log(error);
          reject();
        });
    });
  },
  [types.DO_LOGOUT] ({commit}) {
    // reset token
    axios.defaults.headers['Authorization'] = 'null';
    commit(types.SET_TOKEN, '');
    commit(types.SET_IS_LOGIN, false);
    window.sessionStorage.clear();
    window.localStorage.clear();
  },
  [types.FETCHER_UN_PROCESS_FLAG] ({commit}) {
    fetcher.me.fetchUnProcessFlag().then((res) => {
      commit(types.SET_UNPROCESS_FLAG, res);
    });
  }
};
