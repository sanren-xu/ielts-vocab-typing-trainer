# IELTS Typing Learner 项目状态

## 一、项目基本信息

IELTS Typing Learner 是一个纯前端本地网页应用。当前技术栈是：

- HTML
- CSS
- JavaScript
- localStorage

项目不依赖 React、Vue、Node、数据库或后端服务。数据保存在浏览器本地 localStorage 中。

## 二、当前页面结构

1. `index.html`
   - 首页 / 主入口。
   - 提供录入单词、我的词库、错词复习、设置等入口。

2. `library.html`
   - 我的词库 / 词库管理中心。
   - 支持查看词库列表、切换当前词库、新建、重命名、删除词库、查看词库统计、编辑和删除单词、调整词库顺序。
   - 当前词库可进入普通练习，也可在有错词时进入 `practice.html?mode=wrong`。

3. `input.html`
   - 单词录入页。
   - 支持新建今日词库或追加到当前词库。
   - 支持录入英文、中文、例句，并显示本次录入的单词。
   - 可跳转到 `bulk.html` 做批量导入。

4. `practice.html`
   - 拼写练习页。
   - 默认使用当前词库 `words` 作为练习队列。
   - 支持 `practice.html?mode=wrong`，此时使用当前词库 `wrongWords` 作为练习队列。
   - 支持随机 / 顺序练习、例句提示、显示答案、轮次统计和错词记录。

5. `settings.html`
   - 设置页 / 本地数据管理页。
   - 支持设置例句显示规则、练习顺序。
   - 支持导出、导入、清空本地数据。

6. `wrong.html`
   - 错词复习页。
   - 左侧只显示有错词的词库目录，支持在可见错词词库之间上移 / 下移。
   - 右侧显示当前错词词库的错词列表，支持练习错词和移出错词。

7. `app.html`
   - 旧功能备份页，暂时保留。
   - 不参与当前主流程开发。

8. `bulk.html`
   - 批量导入页，暂时保留。
   - 当前从 `input.html` 可跳转进入，用于批量导入当前词库单词。
   - 当前开发规则中一般不修改该页面。

## 三、当前主要功能

1. 首页入口
   - `index.html` 提供主功能入口：录入今日生词、我的词库、错词复习、设置。

2. 词库管理
   - `library.html` 管理所有词库。
   - 支持新建词库、切换词库、重命名、删除词库。
   - 支持查看当前词库单词数量和错词数量。
   - 支持编辑、删除单词；删除单词时会同步删除该词在 `wrongWords` 中的记录。

3. 单词录入
   - `input.html` 支持录入英文、中文和可选例句。
   - 支持新建今日词库，也支持追加到当前词库。
   - 重复英文单词会被跳过。

4. 普通拼写练习
   - `practice.html` 默认使用当前词库 `words` 练习。
   - 练习时显示中文释义、首字母提示，并根据设置决定是否显示例句。
   - 练习顺序由 `ieltsTypingLearnerPracticeOrder` 控制，支持随机和顺序。

5. 错词记录
   - 普通练习或错词练习中答错单词时，会写入当前词库的 `wrongWords`。
   - 错词按 `wrongCount` 降序、英文升序排序。

6. 错词复习页
   - `wrong.html` 左侧只显示有错词的词库。
   - 当前 `currentLibraryId` 指向无错词词库时，会自动选择第一个有错词的词库。
   - 如果所有词库都没有错词，左侧显示“暂无错词词库”，右侧显示全局空状态。
   - “移出错词”只从当前词库 `wrongWords` 删除，不删除 `words` 中的原单词。

7. 错词练习模式
   - `practice.html?mode=wrong` 使用当前词库 `wrongWords` 作为练习队列。
   - `library.html` 和 `wrong.html` 都有入口进入该模式。

8. 词库上移 / 下移
   - `library.html` 支持调整全部词库顺序。
   - 顺序直接来自 localStorage 中 `libraries` 数组顺序。
   - `wrong.html` 左侧目录读取同一个数组顺序，但只显示有错词的词库，并支持在可见错词词库之间调整顺序。

9. 设置页
   - `settings.html` 支持例句显示规则：始终显示、第二次错误后显示、隐藏。
   - 支持练习顺序：随机、顺序。

10. 本地数据导入 / 导出 / 清空
   - `settings.html` 支持导出当前项目数据备份。
   - 导入会覆盖当前本地数据。
   - 清空本地数据需要二次确认。

## 四、localStorage 数据结构

1. libraries 存储 key
   - `ieltsTypingLearnerLibraries`
   - 值为 JSON 字符串，解析后是词库数组。

2. currentLibraryId 存储 key
   - `ieltsTypingLearnerCurrentLibraryId`
   - 值为当前词库的 `id`。

3. 每个 library 大概包含的字段
   - `id`: 词库唯一 ID，通常形如 `library-${Date.now()}-${random}`。
   - `name`: 词库名称。部分页面会从名称中解析来源信息。
   - `source`: 可选，生词来源。
   - `words`: 普通单词数组。
   - `wrongWords`: 错词数组。

4. words 结构
   - `english`: 英文单词。
   - `chinese`: 中文释义。
   - `example`: 可选例句。

5. wrongWords 结构
   - `english`: 英文单词。
   - `chinese`: 中文释义。
   - `example`: 可选例句。
   - `wrongCount`: 错词累计轮次计数。
   - `correctStreak`: 错词练习中的连续正确次数。

6. settings 相关 key
   - `ieltsTypingLearnerExampleMode`
     - 可选值：`always`、`afterSecondWrong`、`hidden`。
     - 默认值：`afterSecondWrong`。
   - `ieltsTypingLearnerPracticeOrder`
     - 可选值：`random`、`sequential`。
     - 默认值：`random`。

7. legacy words 兼容逻辑
   - 存在旧 key：`ieltsTypingLearnerWords`。
   - `input.html`、`library.html`、`practice.html`、`script.js` 都有读取旧单词数据并转换为默认词库的兼容逻辑。

## 五、错词规则

1. 同一个单词在一轮练习中错多次，`wrongCount` 只加 1。

2. 下一轮再次错同一个单词，`wrongCount` 再加 1。

3. `roundWrongAttempts` 用于统计本轮总错误次数。同一单词一轮内错多次，会累计多次。

4. `roundWrongWords` 用于统计本轮错过的不同单词数量。同一单词一轮内错多次，只统计为 1 个不同错词。

5. `correctStreak` 当前规则
   - 只在 `practice.html?mode=wrong` 的错词练习中答对时增加。
   - 答错时会将该错词的 `correctStreak` 重置为 0。
   - 当 `correctStreak >= 2` 时，该词会自动从当前词库 `wrongWords` 中移除。

6. `wrong.html` 的“移出错词”
   - 只删除当前词库 `wrongWords` 中的记录。
   - 不删除当前词库 `words` 中的原单词。

## 六、当前开发约束

1. 每次只做一个小功能。
2. 开始前先执行 `git status`。
3. 如果 working tree 不是 clean，先说明未提交文件，不要直接乱改。
4. 不要修改 `app.html` / `bulk.html`。
5. 不要引入 React、Vue、Node、数据库或后端。
6. 不要重写项目。
7. 样式复用 `style.css`。
8. 新增样式要少量添加，并复用现有结构。
9. 做完后说明修改文件和测试方式。

## 七、当前仍需注意的问题

1. 多个页面重复实现 localStorage 读写和 normalize 逻辑
   - `input.html`、`library.html`、`practice.html`、`wrong.html`、`settings.html`、`script.js` 都有各自的存储逻辑。
   - 后续维护时容易出现字段默认值或兼容规则不一致。

2. `app.html` / `script.js` 与新页面主流程不完全一致
   - `app.html` 是旧功能备份页，仍引用 `script.js`。
   - `script.js` 中也有错词、导入导出、练习统计等逻辑，但当前主流程已拆到多个 HTML 页面。
   - 后续如果继续保留旧页，需要明确它只是备份，避免误以为它和新页面规则完全同步。

3. `bulk.html` 与当前开发规则存在维护边界
   - `input.html` 仍能跳转到 `bulk.html`。
   - 但当前规则要求一般不修改 `bulk.html`，后续若继续完善批量导入，需要先确认是否恢复该页面为主流程的一部分。

4. README.md 信息偏旧
   - README 仍描述较早期的功能状态。
   - 当前已经有 `library.html`、`settings.html`、`wrong.html`、错词练习模式、数据导入导出、词库排序等功能，README 尚未同步。

5. 页面之间的空状态和按钮禁用规则仍需持续检查
   - `library.html`、`wrong.html`、`practice.html` 已有不少空状态和 disabled 逻辑。
   - 后续新增入口时要同步检查“无词库、无单词、无错词、当前 ID 失效”等状态。

6. 样式命名逐渐混合
   - 新页面大量复用 `home-`、`practice-`、`library-` 类名。
   - 复用降低了样式成本，但也让页面职责和类名前缀不完全对应。

7. 导入数据校验较轻
   - `settings.html` 的备份导入主要校验备份外形，再按 key 恢复字符串。
   - 对 `libraries` 内部字段的深度校验主要依赖各页面加载时 normalize。

8. 编码显示需要留意
   - 在当前 PowerShell 输出中，部分中文文件内容显示为乱码。
   - 这可能是终端编码问题，但后续编辑中文文档和页面文案时仍应注意 UTF-8 保存。

## 八、下一步建议

1. 先提交当前稳定版本。
2. 更新 `README.md`。
3. 后续再明确 `bulk.html` 是否继续纳入主流程。
4. 后续再考虑抽离 `shared.js` 统一 localStorage 和 normalize 逻辑。
5. 后续补充一组手动测试清单。
