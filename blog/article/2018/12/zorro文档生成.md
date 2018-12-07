### zorro源文件有什么
- 每个组件文件夹中包含一个demo文件夹和一个doc文件夹
- demo文件夹包含需要演示的几组demo，每组demo包含两个同名的组件ts文件和文档md文件
- doc文件夹包含组件的api，使用tip等文档内容
- 每个demo一个section， 有一个```nz-code-box```组件用于展示代码部分

### 生成的内容
1. 根据demo中组件ts文件生成一个[nz-demo-{component}-{type}]ts文件用于展示组件
2. 根据组件文件生成html格式的代码
- 同步读文件：
```
String(fs.readFileSync(path.join(demoDirPath, demo)));// 同步读文件并转为字符串
```
- 解析markdown: ```yaml-front-matter```，解析后生成html并添加到生成组件的doc部分
- 代码高亮： node-prismjs拓展 ```site/utils/angular-language-marked.js```
3. 生成模式： 写一个模板组件ts和html，需要替换的地方使用特殊标记，如： ```{{component}}```，在脚本中使用读取的内容替换标记部分并生成文件

### 可以用于我们的部分
- 学习这种标准化的文件结构，方便脚本读取的时候可以直接循环
- 我们做的时候就按照完全标准的格式来写，可以先手写，同时寻找可以用脚本实现自动化的部分，然后用脚本替代需要手工复制或者重复劳动的部分。
