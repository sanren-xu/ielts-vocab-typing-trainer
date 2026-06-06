# PROJECT_STATUS.md

## 1. 当前项目概况

项目名称：IELTS Typing Learner

项目定位：

面向雅思机考考生的个人生词库手打练习工具。

项目已经从单纯的“本地纯前端小工具”扩展为“双版本路线”：

1. `main`：本地稳定版
2. `commercial-v1`：国内商业化 Web 版 V1

当前主线工作在：

`commercial-v1`

---

## 2. 当前分支状态

当前重要分支：

### main

`main` 是本地稳定版。

特点：

1. 纯前端
2. HTML / CSS / JavaScript
3. localStorage 保存数据
4. GitHub Pages 可访问
5. 作为稳定原型保留

`main` 不做商业化大改。

---

### commercial-v1

`commercial-v1` 是商业化 Web 版开发分支。

当前状态：

1. 已从 `main` 创建
2. 已推送到 `origin/commercial-v1`
3. 已新增 `CLOUD_VERSION_PLAN.md`
4. 正在进行文档重整
5. 准备进入前端复盘和后端骨架阶段

`commercial-v1` 允许引入：

1. Node.js
2. Express
3. MySQL
4. 后端 API
5. 注册 / 登录
6. 云端数据
7. 会员系统
8. 订单和支付
9. 管理后台

---

## 3. 当前已完成的本地版功能

当前本地版已经完成：

1. 首页 `index.html`
2. 词库管理 `library.html`
3. 单词录入 `input.html`
4. 普通练习 `practice.html`
5. 错词页 `wrong.html`
6. 错词练习 `practice.html?mode=wrong`
7. 设置页 `settings.html`
8. 数据导入导出
9. 词库排序
10. 错词计数规则
11. GitHub Pages 上线
12. 数据结构 V2 兼容迁移
13. 练习结束后更新 V2 统计字段

---

## 4. 当前本地版页面

当前页面包括：

1. `index.html`：首页
2. `library.html`：词库管理
3. `input.html`：录入单词
4. `practice.html`：拼写练习
5. `wrong.html`：错词复习
6. `settings.html`：设置和数据导入导出
7. `app.html`：旧页面 / 备份页面
8. `bulk.html`：旧批量导入页面 / 暂停维护页面

注意：

`app.html` 和 `bulk.html` 默认不作为当前主流程页面，不在普通任务中随意修改。

---

## 5. 当前数据结构状态

当前本地版主要使用 localStorage。

主要 key：

1. `ieltsTypingLearnerLibraries`
2. `ieltsTypingLearnerCurrentLibraryId`
3. `ieltsTypingLearnerDataVersion`
4. `ieltsTypingLearnerExampleMode`
5. `ieltsTypingLearnerPracticeOrder`

旧兼容 key：

1. `ieltsTypingLearnerWords`

当前 V2 字段包括：

### library 级字段

1. `id`
2. `name`
3. `source`
4. `createdAt`
5. `updatedAt`
6. `lastPracticedAt`
7. `totalPracticeRounds`
8. `words`
9. `wrongWords`

### word 级字段

1. `id`
2. `english`
3. `chinese`
4. `example`
5. `source`
6. `createdAt`
7. `updatedAt`
8. `practiceCount`
9. `correctCount`
10. `wrongRoundCount`
11. `correctStreak`
12. `lastPracticedAt`
13. `mastered`
14. `masteredAt`
15. `inWrongBook`

具体说明见：

- `DATA_MODEL_V2.md`

---

## 6. 当前商业化目标

`commercial-v1` 的目标版本：

IELTS Typing Learner 国内商业化 Web 版 V1

V1 要做：

1. 注册 / 登录
2. 云端保存词库
3. 云端保存练习记录
4. 错词复习
5. 首页学习统计
6. 免费额度限制
7. 一个会员套餐
8. 支付宝支付
9. 支付成功自动开通会员
10. 留言反馈
11. 简单管理后台

V1 暂时不做：

1. 微信支付
2. 小程序
3. AI 写作批改
4. AI 口语陪练
5. 完整雅思模考
6. 大规模内置词库
7. 社区 / 排行榜
8. 多套餐 / 优惠券 / 分销
9. 自动续费
10. 移动 App

---

## 7. 当前开发环境状态

当前本地开发环境已经准备：

1. Git：可用
2. VS Code：可用
3. Node.js：已安装
4. npm：已安装
5. MySQL Server 8.0.46：已安装
6. mysql 命令：可用
7. DBeaver：已安装
8. DBeaver 已连接本地 MySQL
9. `SELECT VERSION()` 测试成功，返回 `8.0.46`
10. Apifox：已安装

当前 MySQL 状态：

1. 本地 MySQL 服务已启动
2. root 用户可登录
3. DBeaver 可连接 `localhost:3306`
4. 当前还没有正式创建项目数据库表

---

## 8. 当前文档状态

已有文档：

1. `README.md`
2. `PROJECT_STATUS.md`
3. `PRODUCT_DIRECTION.md`
4. `COMPETITOR_RESEARCH.md`
5. `DATA_MODEL_V2.md`
6. `CODEX_RULES.md`
7. `CLOUD_VERSION_PLAN.md`
8. `AGENTS.md`
9. `DOC_INDEX.md`

准备新增或完善：

1. `FRONTEND_REVIEW.md`
2. `API_DESIGN.md`
3. `DATABASE_SCHEMA.md`
4. `PAYMENT_FLOW.md`
5. `DEPLOYMENT_PLAN.md`
6. `CHANGELOG.md`

当前正在进行：

第 2.5 阶段：文档重整与前端复盘

---

## 9. 当前阶段

当前阶段不是后端开发。

当前阶段是：

第 2.5 阶段：文档重整与前端复盘

目标：

1. 清理旧文档和新目标的冲突
2. 明确 `main` 和 `commercial-v1` 的区别
3. 新增 `AGENTS.md`
4. 新增 `DOC_INDEX.md`
5. 更新 `PRODUCT_DIRECTION.md`
6. 更新 `README.md`
7. 更新 `CODEX_RULES.md`
8. 新增 `FRONTEND_REVIEW.md`
9. 再决定前端页面改造顺序
10. 最后进入后端骨架

---

## 10. 下一步建议

推荐顺序：

1. 完成文档重整
2. 压缩项目给 ChatGPT 检查文档一致性
3. 根据检查结果修正文档
4. 新增 `FRONTEND_REVIEW.md`
5. 复盘现有前端页面
6. 决定商业化版页面结构
7. 再进入第 3 阶段：后端骨架

第 3 阶段目标：

1. 新增 `backend` 目录
2. 创建 Node.js + Express 基础服务
3. 新增 `/api/health`
4. 新增 `.env.example`
5. 新增 MySQL 连接配置
6. 不做注册登录
7. 不建业务表
8. 不接支付

---

## 11. 当前风险

### 风险 1：旧文档误导 Codex

旧文档中可能还存在：

1. 不做账号系统
2. 不做云同步
3. 不做 Node
4. 不做数据库
5. 不做后端

这些规则只适合旧的本地版，不适合 `commercial-v1`。

处理方式：

文档必须区分 `main` 和 `commercial-v1`。

---

### 风险 2：前端体验还不够成熟

用户已经反馈：

当前页面已有功能还不满意，需要改进。

处理方式：

不要直接写后端硬接旧页面，先做 `FRONTEND_REVIEW.md`。

---

### 风险 3：过早进入支付

支付涉及：

1. 备案
2. 商户资质
3. 订单系统
4. 异步通知
5. 验签
6. 自动开会员
7. 数据安全

处理方式：

先做注册、词库、练习、会员状态，再做订单和支付。

---

### 风险 4：数据库设计不清晰

一旦开始商业化，用户、词库、单词、练习记录、订单、会员都要进入 MySQL。

处理方式：

后续必须创建 `DATABASE_SCHEMA.md`。

---

## 12. 当前 Git 原则

每次任务前：

1. `git status`
2. `git branch`

如果工作区不 clean：

1. 停止
2. 说明未提交文件
3. 等用户确认

不要自动提交。

提交前必须：

1. `git status`
2. `git diff --stat`
3. 只添加本次任务相关文件

不要随便使用：

`git add .`

除非用户明确确认。

---

## 13. 当前重要结论

当前项目重点已经从“继续堆功能”转为：

先理清文档、前端、商业化路线，再继续写代码。

当前最重要的一句话：

保护 `main`，放开 `commercial-v1`；文档先行，小步开发，重大变更先确认。