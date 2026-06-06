# IELTS Typing Learner 国内商业化 Web 版 V1 设计文档

## 一、V1 功能边界

目标：将当前纯前端本地版升级为可在国内上线、可注册登录、可付费开通会员的 Web 版 V1。

V1 仍然聚焦一个核心场景：

> 雅思机考用户创建个人生词库，通过键盘拼写练习和错词复习，把自己遇到的生词练熟。

V1 做：

1. 用户注册、登录、退出。
2. 用户个人词库云端保存。
3. 单词录入、编辑、删除。
4. 普通拼写练习。
5. 错词记录和错词练习。
6. V2 word / library 统计字段云端保存。
7. 本地 localStorage 数据导入到云端账号。
8. 免费额度和会员权限。
9. 支付宝支付开通会员。
10. 留言反馈。
11. 简单管理后台查看用户、订单、反馈。

V1 不改变产品定位，不做大而全背单词平台。

## 二、开发阶段拆分

### 阶段 1：云端基础架构

1. 确定技术栈。
2. 搭建后端 API。
3. 搭建数据库。
4. 搭建登录态和权限校验。
5. 建立用户表、词库表、单词表。
6. 保留现有前端页面结构，逐步从 localStorage 切到 API。

说明：

这里的方向是渐进迁移，而不是简单把旧页面硬接 API。前端接入后端前，需要先明确页面结构、数据来源、状态管理和接口边界。前端体验复盘完成前，不急着全面接后端。

### 阶段 2：账号和词库云同步

1. 注册、登录、退出页面。
2. 当前用户只读写自己的词库。
3. `library.html` 改为从 API 读取词库。
4. `input.html` 改为通过 API 写入单词。
5. `practice.html` 完成练习后通过 API 写入练习统计。
6. `wrong.html` 改为从 API 读取错词。

### 阶段 3：localStorage 迁移

1. 登录后检测本地是否有 `ieltsTypingLearnerLibraries`。
2. 提供“导入本地词库到云端”入口。
3. 导入前显示词库数量、单词数量、错词数量。
4. 用户确认后批量提交到后端。
5. 后端做去重、字段归一化和归属校验。
6. 导入成功后保留本地数据，不自动清空。

### 阶段 4：会员和免费额度

1. 实现免费用户额度限制。
2. 实现会员状态判断。
3. 超出免费额度时提示开通会员。
4. 会员页展示套餐和权益。

### 阶段 5：订单和支付宝支付

1. 创建订单。
2. 发起支付宝网页支付。
3. 支付宝异步通知回调。
4. 验签成功后更新订单状态。
5. 自动开通或续期会员。
6. 用户支付完成后回到会员页查看状态。

### 阶段 6：反馈和管理后台

1. 用户提交留言反馈。
2. 管理员查看反馈。
3. 管理员查看用户、词库数量、订单、会员状态。
4. 管理员手动标记反馈处理状态。

### 阶段 7：部署上线

1. 部署后端服务。
2. 部署前端静态资源。
3. 配置域名、HTTPS、备案。
4. 配置支付宝正式应用。
5. 灰度测试后正式上线。

## 三、数据库表设计

### users

用户表。

| 字段 | 类型 | 说明 |
|---|---|---|
| id | bigint / uuid | 用户 ID |
| email | varchar | 邮箱，可选 |
| phone | varchar | 手机号，可选 |
| password_hash | varchar | 密码哈希 |
| nickname | varchar | 昵称 |
| role | varchar | `user` / `admin` |
| status | varchar | `active` / `disabled` |
| created_at | datetime | 创建时间 |
| updated_at | datetime | 更新时间 |
| last_login_at | datetime | 最近登录时间 |

### memberships

会员表。

| 字段 | 类型 | 说明 |
|---|---|---|
| id | bigint / uuid | 会员记录 ID |
| user_id | bigint / uuid | 用户 ID |
| plan | varchar | 套餐，例如 `monthly` / `yearly` |
| status | varchar | `active` / `expired` / `cancelled` |
| started_at | datetime | 生效时间 |
| expires_at | datetime | 到期时间 |
| created_at | datetime | 创建时间 |
| updated_at | datetime | 更新时间 |

### libraries

词库表。

| 字段 | 类型 | 说明 |
|---|---|---|
| id | bigint / uuid | 词库 ID |
| user_id | bigint / uuid | 所属用户 |
| name | varchar | 词库名称 |
| source | varchar | 生词来源 |
| sort_order | int | 排序 |
| last_practiced_at | datetime | 最近练习时间 |
| total_practice_rounds | int | 累计练习轮数 |
| created_at | datetime | 创建时间 |
| updated_at | datetime | 更新时间 |
| deleted_at | datetime | 软删除时间 |

### words

单词表。

| 字段 | 类型 | 说明 |
|---|---|---|
| id | bigint / uuid | 单词 ID |
| user_id | bigint / uuid | 所属用户 |
| library_id | bigint / uuid | 所属词库 |
| english | varchar | 英文 |
| chinese | text | 中文释义 |
| example | text | 例句 |
| source | varchar | 单词来源 |
| practice_count | int | 练习轮次数 |
| correct_count | int | 答对轮次数 |
| wrong_round_count | int | 答错轮次数 |
| correct_streak | int | 连续正确次数 |
| last_practiced_at | datetime | 最近练习时间 |
| in_wrong_book | boolean | 是否在错词本 |
| mastered | boolean | 是否掌握，V1 可保留字段但不强依赖 |
| mastered_at | datetime | 掌握时间 |
| created_at | datetime | 创建时间 |
| updated_at | datetime | 更新时间 |
| deleted_at | datetime | 软删除时间 |

建议唯一约束：

`user_id + library_id + english + deleted_at`，避免同一词库重复英文单词。

### practice_rounds

练习轮次表。

| 字段 | 类型 | 说明 |
|---|---|---|
| id | bigint / uuid | 练习轮次 ID |
| user_id | bigint / uuid | 用户 ID |
| library_id | bigint / uuid | 词库 ID |
| mode | varchar | `all` / `wrong` |
| total_words | int | 本轮总词数 |
| correct_words | int | 本轮一次答对词数 |
| wrong_words | int | 本轮答错过的不同词数 |
| wrong_attempts | int | 本轮总错误次数 |
| started_at | datetime | 开始时间 |
| ended_at | datetime | 结束时间 |
| created_at | datetime | 创建时间 |

### practice_round_words

练习轮次明细表。

| 字段 | 类型 | 说明 |
|---|---|---|
| id | bigint / uuid | 明细 ID |
| practice_round_id | bigint / uuid | 练习轮次 ID |
| word_id | bigint / uuid | 单词 ID |
| was_wrong | boolean | 本轮是否答错过 |
| wrong_attempts | int | 本词本轮错误次数 |
| created_at | datetime | 创建时间 |

### orders

订单表。

| 字段 | 类型 | 说明 |
|---|---|---|
| id | bigint / uuid | 内部订单 ID |
| order_no | varchar | 商户订单号 |
| user_id | bigint / uuid | 用户 ID |
| plan | varchar | 购买套餐 |
| amount | decimal | 金额 |
| currency | varchar | `CNY` |
| status | varchar | `pending` / `paid` / `closed` / `refunded` |
| payment_channel | varchar | `alipay` |
| alipay_trade_no | varchar | 支付宝交易号 |
| paid_at | datetime | 支付成功时间 |
| created_at | datetime | 创建时间 |
| updated_at | datetime | 更新时间 |

### payment_notifications

支付通知表。

| 字段 | 类型 | 说明 |
|---|---|---|
| id | bigint / uuid | 通知 ID |
| order_no | varchar | 商户订单号 |
| channel | varchar | 支付渠道 |
| raw_payload | json / text | 原始通知内容 |
| verify_status | varchar | `passed` / `failed` |
| handled_at | datetime | 处理时间 |
| created_at | datetime | 创建时间 |

### feedback

留言反馈表。

| 字段 | 类型 | 说明 |
|---|---|---|
| id | bigint / uuid | 反馈 ID |
| user_id | bigint / uuid | 用户 ID，可为空 |
| contact | varchar | 联系方式 |
| category | varchar | `bug` / `suggestion` / `other` |
| content | text | 反馈内容 |
| status | varchar | `open` / `processing` / `closed` |
| admin_note | text | 管理员备注 |
| created_at | datetime | 创建时间 |
| updated_at | datetime | 更新时间 |

## 四、API 接口清单

### 账号

| 方法 | 路径 | 说明 |
|---|---|---|
| POST | `/api/auth/register` | 注册 |
| POST | `/api/auth/login` | 登录 |
| POST | `/api/auth/logout` | 退出 |
| GET | `/api/auth/me` | 当前用户信息 |

### 词库

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/libraries` | 获取当前用户词库列表 |
| POST | `/api/libraries` | 新建词库 |
| GET | `/api/libraries/:id` | 获取词库详情 |
| PATCH | `/api/libraries/:id` | 修改词库名称、来源、排序 |
| DELETE | `/api/libraries/:id` | 删除词库 |
| POST | `/api/libraries/reorder` | 批量调整词库顺序 |

### 单词

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/libraries/:libraryId/words` | 获取词库单词 |
| POST | `/api/libraries/:libraryId/words` | 新增单词 |
| POST | `/api/libraries/:libraryId/words/batch` | 批量导入本地迁移数据 |
| PATCH | `/api/words/:id` | 编辑单词 |
| DELETE | `/api/words/:id` | 删除单词 |

### 练习

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/libraries/:libraryId/practice?mode=all` | 获取普通练习队列 |
| GET | `/api/libraries/:libraryId/practice?mode=wrong` | 获取错词练习队列 |
| POST | `/api/practice-rounds` | 提交一轮练习结果并更新统计 |

### 错词

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/wrong-libraries` | 获取有错词的词库 |
| GET | `/api/libraries/:libraryId/wrong-words` | 获取当前词库错词 |
| PATCH | `/api/words/:id/wrong-book` | 加入或移出错词本 |

### 本地迁移

| 方法 | 路径 | 说明 |
|---|---|---|
| POST | `/api/import/local-storage/preview` | 预览本地数据导入结果 |
| POST | `/api/import/local-storage/confirm` | 确认导入本地数据 |

### 会员和订单

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/membership` | 当前会员状态 |
| GET | `/api/plans` | 套餐列表 |
| POST | `/api/orders` | 创建订单 |
| GET | `/api/orders/:orderNo` | 查询订单状态 |
| POST | `/api/payments/alipay/notify` | 支付宝异步通知 |
| GET | `/api/payments/alipay/return` | 支付宝同步返回 |

### 反馈

| 方法 | 路径 | 说明 |
|---|---|---|
| POST | `/api/feedback` | 提交留言反馈 |
| GET | `/api/admin/feedback` | 管理员查看反馈 |
| PATCH | `/api/admin/feedback/:id` | 管理员更新反馈状态 |

### 管理后台

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/admin/users` | 用户列表 |
| GET | `/api/admin/orders` | 订单列表 |
| GET | `/api/admin/stats` | 简单运营统计 |

## 五、页面改造清单

### 新增页面

1. `login.html`
   - 登录。
   - 跳转注册。

2. `register.html`
   - 注册。
   - 注册成功后自动登录或跳转登录。

3. `membership.html`
   - 展示免费额度、会员权益、套餐。
   - 发起支付宝支付。

4. `import-local.html`
   - 检测本地 localStorage。
   - 预览本地数据。
   - 导入到云端。

5. `feedback.html`
   - 留言反馈。

6. `admin.html`
   - 简单管理后台入口。

### 改造现有页面

1. `index.html`
   - 增加登录状态显示。
   - 显示用户昵称、会员状态。
   - 首页统计改从 API 读取。

2. `library.html`
   - 词库列表改为 API 读取。
   - 新建、重命名、删除、排序改为 API。
   - 单词编辑删除改为 API。

3. `input.html`
   - 新增单词改为 API。
   - 免费额度不足时提示开通会员。

4. `practice.html`
   - 练习队列从 API 获取。
   - 一轮完成后提交练习结果到 API。
   - 保留现有前端反馈体验。

5. `wrong.html`
   - 错词词库和错词列表从 API 获取。
   - 移出错词改为 API。

6. `settings.html`
   - 保留练习设置。
   - 导出可改为导出云端数据。
   - 增加本地数据导入云端入口。

## 六、localStorage 到数据库的迁移思路

当前本地数据主要来自：

1. `ieltsTypingLearnerLibraries`
2. `ieltsTypingLearnerCurrentLibraryId`
3. `ieltsTypingLearnerDataVersion`
4. `ieltsTypingLearnerExampleMode`
5. `ieltsTypingLearnerPracticeOrder`
6. 旧 key：`ieltsTypingLearnerWords`

迁移流程：

1. 用户登录后，前端检测 localStorage 是否存在本地词库数据。
2. 如果存在，提示“发现本地词库，是否导入到云端账号”。
3. 前端把本地数据提交到 `/api/import/local-storage/preview`。
4. 后端执行结构校验和归一化，返回预览：
   - 词库数量。
   - 单词数量。
   - 错词数量。
   - 可能重复的单词数量。
5. 用户确认后，前端调用 `/api/import/local-storage/confirm`。
6. 后端创建 libraries 和 words。
7. `wrongWords` 迁移为 words 表中的：
   - `in_wrong_book = true`
   - `wrong_round_count`
   - `correct_streak`
8. 迁移完成后，本地数据不自动删除。
9. 用户可以在设置页手动清空本地数据。

迁移原则：

1. 不覆盖用户云端已有词库。
2. 同一词库内英文重复时跳过或合并。
3. 保留尽可能多的 V2 字段。
4. 旧数据没有时间字段时，用导入时间补齐。
5. 导入失败不能影响原本 localStorage 数据。

## 七、会员和免费额度规则

V1 建议用简单规则验证商业化：

### 免费用户

1. 最多创建 3 个词库。
2. 最多保存 100 个单词。
3. 可使用普通练习。
4. 可使用错词复习。
5. 可导入本地数据，但超过免费额度的部分需要开通会员后导入。

### 会员用户

1. 词库数量不限或提高到较大上限。
2. 单词数量不限或提高到较大上限。
3. 可使用全部练习统计。
4. 可使用云端数据备份。
5. 可优先使用后续新增功能。

### 套餐建议

1. 月度会员。
2. 年度会员。
3. 早期可以只上年度会员，降低订单和客服复杂度。

### 权限校验点

1. 新建词库。
2. 新增单词。
3. 本地数据导入。
4. 后续统计功能。

## 八、订单系统设计

订单核心状态：

1. `pending`：已创建，待支付。
2. `paid`：支付成功。
3. `closed`：超时关闭或用户取消。
4. `refunded`：已退款。

创建订单流程：

1. 用户在 `membership.html` 选择套餐。
2. 前端调用 `POST /api/orders`。
3. 后端校验用户登录状态和套餐。
4. 后端生成唯一 `order_no`。
5. 后端写入 `orders`，状态为 `pending`。
6. 后端返回支付宝支付参数或支付跳转地址。
7. 前端跳转支付宝收银台。

订单安全要求：

1. 金额以后端套餐配置为准，不能信任前端金额。
2. `order_no` 必须全局唯一。
3. 支付通知必须验签。
4. 支付金额、商户订单号、应用 ID 必须校验。
5. 支付通知可能重复，处理逻辑必须幂等。

## 九、支付宝支付自动开通会员流程

### 支付发起

1. 用户点击开通会员。
2. 前端创建订单。
3. 后端调用支付宝网页支付能力生成支付链接。
4. 用户跳转到支付宝完成支付。

### 异步通知

1. 支付宝请求 `/api/payments/alipay/notify`。
2. 后端记录原始通知到 `payment_notifications`。
3. 后端验证支付宝签名。
4. 后端检查：
   - `app_id` 是否匹配。
   - `out_trade_no` 是否存在。
   - `total_amount` 是否等于订单金额。
   - `trade_status` 是否为成功状态。
5. 如果订单已经是 `paid`，直接返回成功，避免重复开通。
6. 如果订单未支付：
   - 更新订单为 `paid`。
   - 写入 `alipay_trade_no` 和 `paid_at`。
   - 创建或续期 `memberships`。
7. 返回支付宝要求的成功响应。

### 会员续期规则

1. 如果用户没有有效会员，从当前时间开始计算。
2. 如果用户已有有效会员，从当前 `expires_at` 往后续期。
3. 续期完成后，`memberships.status = active`。

### 同步返回

1. 用户支付后回到 `/api/payments/alipay/return` 或前端会员页。
2. 页面通过 `GET /api/orders/:orderNo` 查询订单。
3. 如果异步通知尚未完成，显示“支付确认中”。
4. 以异步通知结果为准，不以同步返回直接开通会员。

## 十、留言反馈和简单管理后台

### 留言反馈

用户可提交：

1. 问题类型。
2. 反馈内容。
3. 联系方式。
4. 当前页面或浏览器信息，可选。

提交后写入 `feedback` 表。

### 简单管理后台

V1 管理后台只做基础功能：

1. 管理员登录。
2. 查看用户列表。
3. 查看用户词库数、单词数、会员状态。
4. 查看订单列表和支付状态。
5. 查看反馈列表。
6. 标记反馈为处理中或已关闭。

后台暂不做复杂权限系统。只区分 `admin` 和普通 `user`。

## 十一、部署、备案、上线流程

### 部署准备

1. 购买国内云服务器或使用国内云平台应用服务。
2. 购买域名。
3. 准备数据库。
4. 配置对象存储或日志存储，可选。
5. 配置 HTTPS 证书。

### 备案

1. 域名实名认证。
2. 提交 ICP 备案。
3. 按云服务商要求完成短信核验和资料提交。
4. 备案通过后，域名解析到国内服务器。
5. 页面底部展示备案号。

### 支付宝准备

1. 注册支付宝开放平台应用。
2. 完成企业或个体工商户相关资料。
3. 配置应用公钥、支付宝公钥。
4. 配置异步通知地址。
5. 配置同步返回地址。
6. 先沙箱测试，再切正式环境。

### 上线流程

1. 本地测试。
2. 测试环境部署。
3. 支付宝沙箱联调。
4. 数据库备份策略确认。
5. 正式环境部署。
6. 小范围真实用户试用。
7. 观察日志、支付通知、订单状态。
8. 正式开放。

## 十二、当前不做的功能

V1 暂时不做：

1. AI 写作批改。
2. AI 口语陪练。
3. 完整雅思模考。
4. 大规模内置词库。
5. 课程售卖。
6. 社区、排名、打卡 PK。
7. 微信支付。
8. 复杂优惠券系统。
9. 分销系统。
10. 多租户机构后台。
11. 复杂复习算法。
12. 图表化学习报告。
13. 移动 App。
14. 小程序。
15. 多语言国际化。

V1 的核心任务是验证：

1. 用户是否愿意注册并把生词库放到云端。
2. 用户是否愿意为更高词库和单词额度付费。
3. 支付、开通会员、练习主流程是否稳定。
