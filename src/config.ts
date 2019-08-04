import website from '../config/website';
import { github_api, leancloud_api } from '../config/api';

export const routeConfig = [{
  exact: true,
  path: '/',
  component: () => import('./pages/home'),
}, {
  exact: true,
  path: '/archives',
  component: () => import('./pages/archives'),
}, {
  exact: true,
  path: '/about',
  component: () => import('./pages/about'),
}, {
  exact: true,
  path: '/post/:number',
  component: () => import('./pages/post'),
}];

export const github_api_prefix = Object.keys(github_api).map(key => `${key}=${github_api[key]}`).join('&');

export {
  website,
  github_api,
  leancloud_api,
};