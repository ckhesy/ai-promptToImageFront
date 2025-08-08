import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '@umijs/max',
  },
  routes: [
    {
      path: '/',
      redirect: '/chat',
    },
    {
      name: '首页',
      path: '/home',
      component: './Home',
      hideInMenu: true,
    },
    {
      name: '权限演示',
      path: '/access',
      component: './Access',
      hideInMenu: true,
    },
    {
      name: ' CRUD 示例',
      path: '/table',
      component: './Table',
      hideInMenu: true,
    },
    {
      name: 'prompt TO Image',
      path: '/promptToImage', 
      component: './PromptToImage',
      hideInMenu: true,
    },
    {
      name: '用户表单',
      path: '/userList', 
      component: './userList',
      hideInMenu: true,
    },
    {
      name: 'chat',
      path: '/chat', 
      component: './chat',
    },
  ],
  npmClient: 'npm',
});

