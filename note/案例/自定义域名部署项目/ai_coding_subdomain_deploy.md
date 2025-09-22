# AI Coding项目，自定义域名部署

## 目标

项目代码部署到:`${repoKey}.preview.domain.com`



## 步骤

1. 项目代码编译后，整个文件夹上传到文件存储中，上传后到文件夹命名为： `${repoKey}`,比如`c4ignfcptk01`
2. `${repoKey}.preview.domain.com`域名的nginx配置文件中，从requestUrl中提取subdomain(即repoKey，比如`c4ignfcptk01`)然后proxy_pass到`${oss bucket域名}/${repoKey}/${相对路径}`,比如`c4ignfcptk01.preview.domain.com/src/main.js`会proxy_pass到`${oss域名}/preview.domain.com/src/main.js`