/*
 DO_开头的为action，其他的为mutation
 */
// 全局操作
export const SET_IS_LOGIN = 'SET_IS_LOGIN';
export const DO_LOGIN = 'DO_LOGIN';
export const DO_LOGOUT = 'DO_LOGOUT';
export const SET_TOKEN = 'SET_TOKEN';
export const DESTROY_TOKEN = 'DESTROY_TOKEN';
export const RESET_QUICK_USER = 'RESET_QUICK_USER';
export const RESET_QUICK_ACTIVITY = 'RESET_QUICK_ACTIVITY';
export const RESET_QUICK_FEEDBACK = 'RESET_QUICK_FEEDBACK';
export const SET_UNPROCESS_FLAG = 'SET_UNPROCESS_FLAG';
// 车辆管理
export const SET_BIKES_PAGINATION_PAGE_SIZE = 'SET_BIKES_PAGINATION_PAGE_SIZE';
export const SET_BIKES_PAGINATION_TOTAL = 'SET_BIKES_PAGINATION_TOTAL';
export const SET_BIKES_PAGINATION_CURRENT = 'SET_BIKES_PAGINATION_CURRENT';
export const SET_BIKES_LAST_UPDATED = 'SET_BIKES_LAST_UPDATED';
export const SET_BIKES_SHOULD_UPDATED = 'SET_BIKES_SHOULD_UPDATED';
export const DESTROY_BIKES_ALL = 'DESTROY_BIKES_ALL';
export const FETCHER_BIKES_TOTAL = 'FETCHER_BIKES_TOTAL';
// actions

// 用户管理
export const SET_USERS_PAGINATION_PAGE_SIZE = 'SET_USERS_PAGINATION_PAGE_SIZE';
export const SET_USERS_PAGINATION_TOTAL = 'SET_USERS_PAGINATION_TOTAL';
export const SET_USERS_PAGINATION_CURRENT = 'SET_USERS_PAGINATION_CURRENT';
export const SET_USERS_LAST_UPDATED = 'SET_USERS_LAST_UPDATED';
export const SET_USERS_SHOULD_UPDATED = 'SET_USERS_SHOULD_UPDATED';
export const DESTROY_USERS_ALL = 'DESTROY_USERS_ALL';
export const FETCHER_USERS_TOTAL = 'FETCHER_USERS_TOTAL';
export const FETCHER_USERS_UNPROCESS_TOTAL = 'FETCHER_USERS_UNPROCESS_TOTAL';

// 反馈管理
export const SET_FEEDBACK_PAGINATION_TOTAL = 'SET_FEEDBACK_PAGINATION_TOTAL';
export const SET_FEEDBACK_PAGINATION_PAGE_SIZE = 'SET_FEEDBACK_PAGINATION_PAGE_SIZE';
export const SET_FEEDBACK_PAGINATION_CURRENT = 'SET_FEEDBACK_PAGINATION_CURRENT';
export const SET_FEEDBACK_LAST_UPDATED = 'SET_FEEDBACK_LAST_UPDATED';
export const SET_FEEDBACK_SHOULD_UPDATED = 'SET_FEEDBACK_SHOULD_UPDATED';
export const DESTROY_FEEDBACK_ALL = 'DESTROY_FEEDBACK_ALL';
export const FETCHER_FEEDBACK_TOTAL = 'FETCHER_FEEDBACK_TOTAL';
export const FETCHER_FEEDBACK_UNPROCESS_TOTAL = 'FETCHER_FEEDBACK_UNPROCESS_TOTAL';
// 活动管理
export const SET_ACTIVITIES_PAGINATION_TOTAL = 'SET_ACTIVITIES_PAGINATION_TOTAL';
export const SET_ACTIVITIES_PAGINATION_PAGE_SIZE = 'SET_ACTIVITIES_PAGINATION_PAGE_SIZE';
export const SET_ACTIVITIES_PAGINATION_CURRENT = 'SET_ACTIVITIES_PAGINATION_CURRENT';
export const SET_ACTIVITIES_LAST_UPDATED = 'SET_ACTIVITIES_LAST_UPDATED';
export const SET_ACTIVITIES_SHOULD_UPDATED = 'SET_ACTIVITIES_SHOULD_UPDATED';
export const DESTROY_ACTIVITIES_ALL = 'DESTROY_ACTIVITIES_ALL';
export const FETCHER_ACTIVITY_TOTAL = 'FETCHER_ACTIVITY_TOTAL';
export const FETCHER_ACTIVITY_UNPROCESS_TOTAL = 'FETCHER_ACTIVITY_UNPROCESS_TOTAL';

// 权限管理
export const INITIAL_ALL_PRIVILEGES = 'INITIAL_ALL_PRIVILEGES';
export const FETCH_ALL_PRIVILEGES = 'FETCH_ALL_PRIVILEGES';
export const FETCH_PRIVILEGES_TOTAL = 'FETCH_PRIVILEGES_TOTAL';
export const FETCH_ADMIN_PRIVILEGES = 'FETCH_ADMIN_PRIVILEGES';

// 个人中心
export const SET_ADMIN_INFO = 'SET_ADMIN_INFO';
export const RESET_ADMIN_INFO = 'RESET_ADMIN_INFO';
export const SET_ADMIN_PRIVILEGE = 'SET_ADMIN_PRIVILEGE';
export const RESET_PASSWORD = 'RESET_PASSWORD';
export const FETCH_PRIVILEGE = 'FETCH_PRIVILEGE';
