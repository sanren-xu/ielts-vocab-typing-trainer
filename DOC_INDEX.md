# DOC_INDEX.md

## 1. 文档用途

本文件是 IELTS Typing Learner 项目的文档索引。

作用：

1. 说明每个 `.md` 文件是干什么的
2. 帮助用户和 Codex 快速恢复项目上下文
3. 避免旧文档和新目标互相冲突
4. 明确哪些文档是当前主线，哪些文档是历史参考

当前项目已经从“纯前端本地版”扩展为“双版本路线”：

- `main`：本地稳定版
- `commercial-v1`：国内商业化 Web 版 V1

---

## 2. 当前核心文档

### README.md

项目对外说明文档。

应该说明：

- 项目是什么
- 当前有哪些版本
- `main` 分支是什么
- `commercial-v1` 分支是什么
- 当前技术路线
- 如何运行本地版
- 商业化版计划

注意：

> `README.md` 不应该只描述旧的纯前端版本，也要说明 `commercial-v1` 的商业化方向。

---

### PROJECT_STATUS.md

项目当前状态总览。

应该说明：

- 当前分支状态
- 已完成功能
- 当前技术环境
- 当前阶段
- 下一步任务
- 已知风险
- 暂不做事项

用途：

> 每次长时间中断后，先看这个文件恢复项目进度。

---

### PRODUCT_DIRECTION.md

产品定位和边界文档。

应该说明：

- 项目面向谁
- 解决什么问题
- 核心价值是什么
- 和大词库 / 模考 / AI 批改工具的区别
- `main` 本地版定位
- `commercial-v1` 商业化版定位
- V1 做什么
- V1 不做什么

注意：

> 这个文件不能继续写“不做账号、后端、数据库”，因为 `commercial-v1` 已经允许这些内容。

---

### COMPETITOR_RESEARCH.md

竞品研究文档。

主要记录：

- Qwerty Learner
- Type Words
- 其他 typing / vocabulary 工具
- 本项目和竞品的区别
- 哪些功能值得参考
- 哪些方向不要跟风

用途：

> 帮助项目保持差异化，不盲目变成大而全背单词软件。

---

### DATA_MODEL_V2.md

本地版 V2 数据结构文档。

主要说明：

- localStorage 数据结构
- library 字段
- word 字段
- wrongWords 保留策略
- V2 迁移规则
- inWrongBook
- wrongRoundCount
- correctStreak
- practiceCount
- correctCount
- lastPracticedAt

适用范围：

- 主要适用于 `main` 本地版
- 也可以作为 `commercial-v1` 数据库设计的参考

注意：

> `commercial-v1` 最终会使用 MySQL，不会继续只依赖 localStorage。

---

### CODEX_RULES.md

旧版 Codex 协作规则文档。

历史作用：

- 约束 Codex 不乱改项目
- 记录本地版开发规则
- 保护 app.html / bulk.html
- 限制大规模重构

当前处理方式：

- 保留，但需要更新

后续定位：

> `CODEX_RULES.md` 可以作为人类可读的协作说明，但长期规则以 `AGENTS.md` 为准。

---

### CLOUD_VERSION_PLAN.md

国内商业化 Web 版 V1 开发路线文档。

主要说明：

- 商业化版本目标
- 0 到 10 阶段开发路线
- Node.js + Express + MySQL 技术路线
- 注册登录
- 云端词库
- 会员系统
- 订单系统
- 支付宝支付
- 留言反馈
- 管理后台
- 部署、备案、上线流程

适用范围：

- `commercial-v1` 分支

这是当前商业化开发的主线文档之一。

---

### AGENTS.md

Codex 项目级长期规则文档。

作用：

- 告诉 Codex 当前项目身份
- 说明分支策略
- 说明 `main` 和 `commercial-v1` 的区别
- 规定每次任务前必须 `git status` / `git branch`
- 规定工作区不 clean 不继续
- 规定每次只做一个小功能
- 规定敏感信息不能提交
- 规定 app.html / bulk.html 默认不乱改
- 规定商业化开发允许 Node.js / MySQL / 后端 / 支付

注意：

> Codex 后续应该优先参考 `AGENTS.md`。

---

### FRONTEND_REVIEW.md

前端页面复盘和改造计划文档。

应该说明：

- 当前有哪些页面
- 每个页面的问题
- 哪些页面保留
- 哪些页面重做
- 哪些页面新增
- 商业化版本页面结构
- 页面改造优先级
- 哪些页面先做静态原型
- 哪些页面必须等 API 完成后再接入

当前状态：

- 已新增 / 持续完善

---

## 3. 后续建议新增文档

### API_DESIGN.md

后端 API 设计文档。

建议记录：

- 接口列表
- 请求方法
- 请求路径
- 请求参数
- 返回格式
- 登录鉴权规则
- Apifox 测试方法

适用阶段：

- 后端骨架完成后
- 注册登录开发前

---

### DATABASE_SCHEMA.md

MySQL 数据库结构文档。

建议记录：

- users
- libraries
- words
- practice_rounds
- practice_word_results
- memberships
- orders
- payments
- feedback
- admin_users

每张表应说明：

- 字段名
- 类型
- 是否必填
- 默认值
- 作用
- 索引
- 关联关系

---

### PAYMENT_FLOW.md

支付流程文档。

建议记录：

- 创建订单
- 支付宝支付
- notify_url
- 验签
- 核对金额
- 修改订单状态
- 自动开通会员
- 幂等处理
- 异常订单处理

适用阶段：

- 订单系统完成后
- 接支付宝支付前

---

### DEPLOYMENT_PLAN.md

部署和上线文档。

建议记录：

- 域名
- 国内云服务器
- MySQL 部署
- Node.js 部署
- Nginx
- PM2
- HTTPS
- ICP 备案
- 支付审核
- 数据备份
- 停运预案

---

### CHANGELOG.md

变更记录文档。

建议记录：

- 每次重要提交
- 修改了什么
- 为什么改
- 是否影响数据
- 是否影响用户

---

## 4. 当前推荐阅读顺序

如果要从头理解项目，建议按这个顺序看：

1. `README.md`
2. `PRODUCT_DIRECTION.md`
3. `PROJECT_STATUS.md`
4. `DATA_MODEL_V2.md`
5. `CLOUD_VERSION_PLAN.md`
6. `FRONTEND_REVIEW.md`
7. `AGENTS.md`
8. `CODEX_RULES.md`
9. `COMPETITOR_RESEARCH.md`

---

## 5. 当前文档优先级

当前最应该先整理：

1. `AGENTS.md`
2. `DOC_INDEX.md`
3. `PRODUCT_DIRECTION.md`
4. `PROJECT_STATUS.md`
5. `README.md`
6. `FRONTEND_REVIEW.md`
7. `CODEX_RULES.md`

暂时不急着创建：

1. `API_DESIGN.md`
2. `DATABASE_SCHEMA.md`
3. `PAYMENT_FLOW.md`
4. `DEPLOYMENT_PLAN.md`
5. `CHANGELOG.md`

这些可以等后端和数据库真正开始后逐步补。

---

## 6. 文档维护原则

以后每次修改文档时，要注意：

1. 不要让旧目标和新目标冲突
2. 不要让 `main` 和 `commercial-v1` 的规则混在一起
3. 本地版规则只约束 `main`
4. 商业化规则约束 `commercial-v1`
5. 旧页面不是永远不能动，而是默认不乱动
6. 重大方向变化必须更新 `PROJECT_STATUS.md`
7. 数据结构变化必须更新 `DATA_MODEL_V2.md` 或 `DATABASE_SCHEMA.md`
8. API 变化必须更新 `API_DESIGN.md`
9. 支付流程变化必须更新 `PAYMENT_FLOW.md`
