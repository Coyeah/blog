# 新建 github 文件

路径：`common/github.ignore.ts`

文件内容：

```javascript
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
