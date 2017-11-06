import Vue from 'vue';
import Router from 'vue-router';
import Index from '../components/Index';

// TODO app路径
var _dirname = '/admin/';
Vue.use(Router);

export default new Router({
  mode: 'history',
  base: _dirname,
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: resolve => require(['../components/Login'], resolve)
    },
    {
      path: '/bikes',
      name: 'Bikes',
      component: Index,
      redirect: '/bikes/all',
      children: [
        {
          path: 'all',
          name: 'AllBikes',
          meta: {requiresAuth: true},
          component: resolve => require(['../components/AllBikes'], resolve)
        },
        {
          path: 'add',
          name: 'AddBike',
          meta: {requiresAuth: true},
          component: resolve => require(['../components/AddBike'], resolve)
        }
      ]
    },
    {
      path: '/users',
      name: 'Users',
      component: Index,
      redirect: '/users/all',
      children: [
        {
          path: 'all',
          name: 'AllUsers',
          meta: {requiresAuth: true},
          component: resolve => require(['../components/AllUsers'], resolve)
        },
        {
          path: 'add',
          name: 'AddUser',
          meta: {requiresAuth: true},
          component: resolve => require(['../components/AddUser'], resolve)
        },
        {
          path: 'deal',
          name: 'Deal',
          meta: {requiresAuth: true},
          component: resolve => require(['../components/DealRecords'], resolve)
        },
        {
          path: 'cycling',
          name: 'Cycling',
          meta: {requiresAuth: true},
          component: resolve => require(['../components/CyclingRecords'], resolve)
        }
      ]
    },
    {
      path: '/feedback',
      name: 'Feedback',
      component: Index,
      redirect: '/feedback/all',
      children: [
        {
          path: 'all',
          name: 'AllFeedback',
          meta: {requiresAuth: true},
          component: resolve => require(['../components/AllFeedback'], resolve)
        },
        {
          path: 'statistics',
          name: 'FeedbackStatistics',
          meta: {requiresAuth: true},
          component: resolve => require(['../components/FeedbackStatistics'], resolve)
        }
      ]
    },
    {
      path: '/activities',
      name: 'Activities',
      component: Index,
      redirect: '/activities/all',
      children: [
        {
          path: 'all',
          name: 'AllActivities',
          meta: {requiresAuth: true},
          component: resolve => require(['../components/AllActivities'], resolve)
        },
        {
          path: 'statistics',
          name: 'ActivitiesStatistics',
          meta: {requiresAuth: true},
          component: resolve => require(['../components/ActivitiesStatistics'], resolve)
        }
      ]
    },
    {
      path: '/config',
      name: 'Config',
      component: Index,
      redirect: '/config/info',
      children: [
        {
          path: 'info',
          name: 'config',
          meta: {requiresAuth: true},
          component: resolve => require(['../components/Config'], resolve)
        }
      ]
    },
    {
      path: '/privileges',
      name: 'auth',
      component: Index,
      redirect: '/privileges/all',
      children: [
        {
          path: 'all',
          name: 'privileges',
          meta: {requiresAuth: true},
          component: resolve => require(['../components/Privileges'], resolve)
        },
        {
          path: 'modify',
          name: 'ModifyPrivileges',
          meta: {requiresAuth: true},
          component: resolve => require(['../components/ModifyPrivileges'], resolve)
        }
      ]
    },
    {
      path: '/me',
      name: 'Me',
      component: Index,
      redirect: '/me/info',
      children: [
        {
          path: 'info',
          name: 'Info',
          meta: {requiresAuth: true},
          component: resolve => require(['../components/Me'], resolve)
        },
        {
          path: 'resetpwd',
          name: 'ResetPassword',
          meta: {requiresAuth: true},
          component: resolve => require(['../components/ResetPassword'], resolve)
        }
      ]
    },
    {
      path: '/exit',
      redirect: '/'
    }
  ]
});
