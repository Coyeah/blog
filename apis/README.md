# 新建 `config.js` 文件

文件内容：

``` JavaScript
export const github_config = {
  client_id: '**********',
  client_secret: '**********'
};

export const github_api_prefix = Object.keys(github_config).map(key => `${key}=${github_config[key]}`).join('&');

export const leancloud_api = {
  appId: '**********',
  appKey: '**********'
}
```