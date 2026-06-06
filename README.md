# IELTS Typing Learner

IELTS Typing Learner 是一个面向雅思机考考生的个人生词库手打练习工具。

它的核心不是大词库，也不是完整雅思模考，而是：

用户把自己在雅思阅读、听力、写作和学习资料中遇到的生词，手动录入个人词库，然后通过键盘输入练习英文拼写，并通过错词复习把词练熟。

---

## 1. 项目当前路线

本项目现在有两条路线：

### main：本地稳定版

`main` 是当前稳定的本地版。

特点：

1. 纯前端
2. HTML / CSS / JavaScript
3. localStorage 保存数据
4. 不需要后端
5. 不需要数据库
6. 可以直接用浏览器打开
7. 已部署 GitHub Pages

适合作为：

1. 本地原型
2. 稳定备份
3. 功能验证版本
4. 纯前端作品展示

---

### commercial-v1：国内商业化 Web 版

`commercial-v1` 是商业化 Web 版开发分支。

目标是把本地版升级为：

可以注册登录、云端保存、会员付费、正式上线的国内商业化 Web 产品。

计划技术路线：

1. 前端：HTML / CSS / JavaScript
2. 后端：Node.js + Express
3. 数据库：MySQL
4. API 测试：Apifox
5. 数据库管理：DBeaver
6. 支付：支付宝电脑网站支付
7. 部署：国内云服务器

---

## 2. 产品定位

目标用户：

1. 雅思机考考生
2. 正在积累阅读 / 听力 / 写作生词的学生
3. 想练英文拼写和键盘输入的人
4. 不想背大词库，只想练自己生词的人

核心使用场景：

1. 用户做雅思阅读时遇到生词
2. 用户把生词录入自己的词库
3. 用户通过中文意思或例句提示回忆英文
4. 用户手动输入英文单词
5. 答错的词自动进入错词复习
6. 通过反复练习提高熟悉度

---

## 3. 当前本地版功能

当前本地版已经包含：

1. 首页
2. 词库管理
3. 单词录入
4. 普通拼写练习
5. 错词记录
6. 错词复习
7. 设置页
8. 数据导入
9. 数据导出
10. 数据清空
11. 词库排序
12. V2 数据结构兼容迁移
13. 练习统计字段更新

---

## 4. 当前页面

主要页面：

1. `index.html`：首页
2. `library.html`：词库管理
3. `input.html`：单词录入
4. `practice.html`：拼写练习
5. `wrong.html`：错词复习
6. `settings.html`：设置页

旧页面 / 暂停维护页面：

1. `app.html`
2. `bulk.html`

说明：

`app.html` 和 `bulk.html` 默认不在普通任务中修改。后续商业化版本如需处理，应先评估保留、废弃、重定向或合并。

---

## 5. 当前本地版技术

本地版技术：

1. HTML
2. CSS
3. JavaScript
4. localStorage

本地版不需要：

1. Node.js
2. MySQL
3. 后端服务
4. 登录系统
5. 支付系统

---

## 6. commercial-v1 计划功能

商业化 V1 计划包含：

1. 注册 / 登录
2. 云端词库
3. 云端单词保存
4. 云端练习记录
5. 错词复习
6. 首页学习统计
7. 免费额度限制
8. 一个会员套餐
9. 支付宝支付
10. 支付成功自动开通会员
11. 留言反馈
12. 简单管理后台

暂时不做：

1. 微信支付
2. 小程序
3. 移动 App
4. AI 写作批改
5. AI 口语陪练
6. 完整雅思模考
7. 大规模内置词库
8. 社区 / 排行榜
9. 多套餐 / 优惠券
10. 自动续费

---

## 7. 本地运行方式

本地版可以直接用浏览器打开：

1. `index.html`
2. `library.html`
3. `input.html`
4. `practice.html`
5. `wrong.html`
6. `settings.html`

也可以使用 VS Code 的 Live Server 插件打开。

---

## 8. 数据保存方式

当前本地版数据保存在浏览器 localStorage 中。

主要 key：

1. `ieltsTypingLearnerLibraries`
2. `ieltsTypingLearnerCurrentLibraryId`
3. `ieltsTypingLearnerDataVersion`
4. `ieltsTypingLearnerExampleMode`
5. `ieltsTypingLearnerPracticeOrder`

注意：

清空浏览器数据可能导致本地词库丢失。正式商业化版本会改为 MySQL 云端保存。

---

## 9. 当前商业化开发环境

当前已准备：

1. Git
2. VS Code
3. Node.js
4. npm
5. MySQL Server 8.0.46
6. DBeaver
7. Apifox

MySQL 已通过 DBeaver 连接测试。

---

## 10. 重要文档

建议先看：

1. `PRODUCT_DIRECTION.md`
2. `PROJECT_STATUS.md`
3. `CLOUD_VERSION_PLAN.md`
4. `DATA_MODEL_V2.md`
5. `AGENTS.md`
6. `DOC_INDEX.md`
7. `FRONTEND_REVIEW.md`

文档说明见：

`DOC_INDEX.md`

---

## 11. 开发原则

1. 每次只做一个小功能
2. 开始前先 `git status` 和 `git branch`
3. 工作区不 clean 不继续
4. 保护 `main` 分支
5. `commercial-v1` 用于商业化开发
6. 不乱改 `app.html` / `bulk.html`
7. 不提交敏感信息
8. 不自动 commit
9. 做完说明修改文件和测试方式

核心原则：

保护 `main`，放开 `commercial-v1`；小步修改，重大变更先确认。