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

export const github_api_config = {
  client_id: '1eeae60664b37e276392',
  client_secret: 'abbe4c4ddebec3d286675849e1aa81b9e7c6f5ee'
}

export const github_api_config_prefix = Object.keys(github_api_config).map(key => `${key}=${github_api_config[key]}`).join('&');

export const info = {
  "owner": "coyeah",
  "repo": "blog",
  "title": "Coyeah's Blog",
  "author": "Coyeah chen",
  "description": "Coyeah 的个人博客",
  "siteUrl": "https://www.coyeah.top",
  "github": "https://github.com/Coyeah",
  "licenses": "http://creativecommons.org/licenses/by-nc/4.0/",
  "since": 2017,
}