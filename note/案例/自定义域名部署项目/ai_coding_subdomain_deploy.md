# AI Coding项目，自定义域名部署

## 目标

项目代码部署到:`${repoKey}.preview.domain.com`



## 步骤

1. 代码上传到gitlab，触发gitlab pipeline执行build job（ci文件见附录）
2. Build job编译代码，项目代码编译后，整个文件夹上传到文件存储中，上传后到文件夹命名为： `${repoKey}`,比如`c4ignfcptk01`
3. `${repoKey}.preview.domain.com`域名的nginx配置文件中，从requestUrl中提取subdomain(即repoKey，比如`c4ignfcptk01`)然后proxy_pass到`${oss bucket域名}/${repoKey}/${相对路径}`,比如`c4ignfcptk01.preview.domain.com/src/main.js`会proxy_pass到`${oss域名}/preview.domain.com/src/main.js`



## 附录

### git ci.yml

```
# GitLab CI pipeline: 构建 React + TypeScript + Vite 项目（pnpm）

image: images-hackers.wingent.ai/ai-group/node:wingent

stages:
  - build

variables:
  PNPM_STORE_DIR: /root/.pnpm-store
  CI: "true" 
  NODE_ENV: "production"

# ✅ 优化 1：精准缓存 key + 增加 Vite 缓存目录
cache:
  key:
    files:
      - pnpm-lock.yaml
  paths:
    - .pnpm-store/
#    - node_modules/
#    - node_modules/.vite/

build:
  stage: build
  interruptible: true

  before_script:
    # COS 配置（必要，无法省略）
    - mkdir -p ~/.cos
    - |
      cat > ~/.cos.yaml <<EOF
      cos:
        base:
          secretid: ${TENCENT_CLOUD_SECRET_ID}
          secretkey: ${TENCENT_CLOUD_SECRET_KEY}
          protocol: https
        buckets:
          - name: ${COS_BUCKET}
            region: ${COS_REGION}
            alias: wingent
      EOF
    - coscli ls cos://wingent/ 2>/dev/null || echo "✅ COS 配置已加载"

  script:
    - pnpm install
    - pnpm build --mode production --emptyOutDir --logLevel warn
    - coscli cp -r --routines=8 dist/ cos://wingent/$CI_PROJECT_NAME/

  artifacts:
    when: on_success
    expire_in: 7 days
    paths:
      - dist/

  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
      when: on_success
    - if: $CI_COMMIT_BRANCH
      when: on_success
```

