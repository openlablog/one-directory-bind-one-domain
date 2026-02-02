![](https://socialify.git.ci/openlablog/one-directory-bind-one-domain/image?custom_language=JavaScript&description=1&forks=1&issues=1&language=1&name=1&owner=1&pattern=Transparent&pulls=1&stargazers=1&theme=Auto&t=879732165)

## 功能

1. 添加目录路径：让一个目录绑定一个域名
2. 删除目录路径：让链接隐藏掉目录路径
3. 替换所有后端域名为前端域名

## 修改_worker.js里的后端域名

```javascript
...
let url = new URL(request.url);

// 后端域名，nethely.hu的免费二级域名，不带 http 和 /，例如 site.yourname.nhely.hu
let backend_host = "site.yourname.nhely.hu";
...
```

## 部署

1. Fork本仓库
2. 创建workers部署即可
