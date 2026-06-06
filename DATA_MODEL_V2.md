# DATA_MODEL_V2

## 适用范围说明

本文档主要适用于 `main` 本地稳定版和 localStorage V2 数据结构设计。

`commercial-v1` 会逐步引入 MySQL、后端 API、账号、云端词库、练习记录云端保存、会员和支付。

本文档中“暂时不要做账号 / 云同步 / 支付”等限制，只约束本地版或当前数据结构阶段，不约束 `commercial-v1` 的商业化目标。

## 一、当前数据结构概览

当前项目是纯前端本地网页应用，数据主要保存在 localStorage 中。

主要 key：

1. `ieltsTypingLearnerLibraries`
   - 当前词库数组。
   - 每个词库包含 `id`、`name`、`words`、`wrongWords` 等字段。

2. `ieltsTypingLearnerCurrentLibraryId`
   - 当前选中词库 ID。

3. `words`
   - 存在于每个 library 内部。
   - 当前主要字段：`english`、`chinese`、`example`。

4. `wrongWords`
   - 存在于每个 library 内部。
   - 当前主要字段：`english`、`chinese`、`example`、`wrongCount`、`correctStreak`。

5. settings 相关 key
   - `ieltsTypingLearnerExampleMode`
   - `ieltsTypingLearnerPracticeOrder`

兼容旧数据的 key：

- `ieltsTypingLearnerWords`

## 二、当前数据结构的问题

1. 单词只有基本信息，不够支持学习统计
   - 当前 `words` 只有英文、中文、例句。
   - 无法直接统计每个单词练过几次、答对几次、错过几轮、是否掌握。

2. `wrongWords` 和 `words` 之间存在重复数据
   - `wrongWords` 会复制 `english`、`chinese`、`example`。
   - 当普通单词被编辑时，需要额外同步错词数据。
   - 长期看容易出现同一个单词在两处信息不一致。

3. 缺少练习历史
   - 当前只记录本轮页面状态和错词结果。
   - 无法回看某一轮练习的开始时间、结束时间、练习模式、错词情况。

4. 缺少每日统计
   - 无法直接显示今日新增、今日练习、今日掌握、今日错词等数据。

5. 缺少掌握状态
   - 当前只有 `correctStreak`，且主要服务错词移除。
   - 没有明确字段表示一个普通单词是否已经掌握。

6. 后续做首页统计会遇到的问题
   - 累计词汇可以从 `words.length` 计算。
   - 当前错词可以从 `wrongWords.length` 计算。
   - 但今日新增、已掌握词数、最近练习时间、练习轮数、练习趋势等都缺少稳定来源。

## 三、下一版 library 建议结构

建议下一版每个 library 结构如下：

```js
{
  id: "library-...",
  name: "剑雅18 Test 1 Passage 1",
  source: "剑雅18 Test 1 Passage 1",
  createdAt: "2026-06-03T10:00:00.000Z",
  updatedAt: "2026-06-03T10:20:00.000Z",
  lastPracticedAt: "2026-06-03T11:00:00.000Z",
  totalPracticeRounds: 3,
  words: []
}
```

字段说明：

- `id`: 词库唯一 ID。
- `name`: 词库名称。
- `source`: 可选，来源信息。
- `createdAt`: 创建时间。
- `updatedAt`: 最近编辑时间。
- `lastPracticedAt`: 最近练习时间。
- `totalPracticeRounds`: 该词库累计练习轮数。
- `words`: 单词数组。

## 四、下一版 word 建议结构

建议下一版每个 word 结构如下：

```js
{
  id: "word-...",
  english: "evidence",
  chinese: "证据；根据",
  example: "The evidence is clear.",
  source: "剑雅18 Test 1 Passage 1",
  createdAt: "2026-06-03T10:00:00.000Z",
  updatedAt: "2026-06-03T10:10:00.000Z",
  practiceCount: 5,
  correctCount: 3,
  wrongRoundCount: 2,
  correctStreak: 1,
  lastPracticedAt: "2026-06-03T11:00:00.000Z",
  mastered: false,
  masteredAt: null
}
```

字段说明：

- `id`: 单词唯一 ID。
- `english`: 英文单词。
- `chinese`: 中文释义。
- `example`: 可选例句。
- `source`: 可选，单词来源。
- `createdAt`: 创建时间。
- `updatedAt`: 最近编辑时间。
- `practiceCount`: 该词累计出现在练习中的次数。
- `correctCount`: 该词累计答对次数。
- `wrongRoundCount`: 该词累计错过的练习轮数。
- `correctStreak`: 连续答对次数。
- `lastPracticedAt`: 最近练习时间。
- `mastered`: 是否已掌握。
- `masteredAt`: 标记为掌握的时间。

## 五、wrongWords 是否还需要单独存在

### 方案 A：继续保留 wrongWords 数组

优点：

- 改动小，兼容当前代码。
- `wrong.html` 和 `practice.html?mode=wrong` 可以继续直接读取 `wrongWords`。
- 当前错词列表渲染简单。

缺点：

- `wrongWords` 和 `words` 会重复保存英文、中文、例句。
- 编辑单词时需要同步两处数据。
- 后续统计“已掌握、错词趋势、练习历史”时，数据容易分散。

### 方案 B：不再单独存 wrongWords，而是在 words 中标记错词状态

示例：

```js
{
  id: "word-...",
  english: "evidence",
  wrongRoundCount: 2,
  correctStreak: 0,
  mastered: false,
  inWrongBook: true
}
```

优点：

- 单词信息只有一份，不会重复。
- 编辑单词后不需要同步 `wrongWords`。
- 更适合后续做首页统计、掌握状态、练习记录。

缺点：

- 需要迁移旧的 `wrongWords` 数据。
- `wrong.html` 和 `practice.html?mode=wrong` 要改为从 `words` 中筛选错词。

### 当前项目更适合的方案

建议下一阶段采用方案 B：不再把 `wrongWords` 作为长期主数据源，而是在 `words` 里用字段表示错词状态。

原因：

1. 产品下一阶段要增强积累感和学习记录，统计应该围绕单词本身展开。
2. 单词的练习次数、答对次数、错过轮数、掌握状态都应该属于 word。
3. 减少 `words` 和 `wrongWords` 重复数据，可以降低后续维护风险。

### 如何兼容现有 wrongWords 数据

迁移时不要删除旧数据。建议步骤：

1. 先遍历每个 library 的 `words`，给每个 word 补 `id` 和统计字段。
2. 再遍历该 library 的 `wrongWords`。
3. 用 `english` 匹配 `words` 中的单词。
4. 如果匹配到：
   - 将 `wrongCount` 合并到 word 的 `wrongRoundCount`。
   - 将 `correctStreak` 合并到 word 的 `correctStreak`。
   - 标记 `inWrongBook: true` 或 `mastered: false`。
5. 如果没有匹配到：
   - 可以从 wrongWord 创建一个新的 word，避免用户旧错词丢失。
6. 迁移后可以暂时保留原 `wrongWords` 字段，作为兼容备份。

## 六、practiceHistory 是否需要

需要，但第一阶段不一定必须实现。

建议结构：

```js
{
  id: "practice-...",
  libraryId: "library-...",
  mode: "all",
  startedAt: "2026-06-03T11:00:00.000Z",
  endedAt: "2026-06-03T11:08:00.000Z",
  totalWords: 20,
  correctWords: 16,
  wrongAttempts: 7,
  wrongWordIds: ["word-1", "word-2"]
}
```

字段说明：

- `id`: 练习记录唯一 ID。
- `libraryId`: 所属词库 ID。
- `mode`: `all` 或 `wrong`。
- `startedAt`: 开始时间。
- `endedAt`: 结束时间。
- `totalWords`: 本轮练习词数。
- `correctWords`: 本轮完全正确的词数。
- `wrongAttempts`: 本轮总错误次数。
- `wrongWordIds`: 本轮错过的不同单词 ID。

第一阶段是否必须做：

- 不是必须。
- 第一阶段可以先更新 word 级别统计和 library 级别统计。
- 等首页统计稳定后，再补完整 practiceHistory。

## 七、dailyStats 是否需要

需要，但第一阶段也不一定必须完整实现。

建议结构：

```js
{
  date: "2026-06-03",
  addedWords: 5,
  practicedWords: 20,
  correctWords: 16,
  wrongWords: 3,
  masteredWords: 2,
  practiceRounds: 1
}
```

字段说明：

- `date`: 日期，格式 `YYYY-MM-DD`。
- `addedWords`: 当日新增单词数。
- `practicedWords`: 当日练习过的单词数量。
- `correctWords`: 当日答对单词数量。
- `wrongWords`: 当日错过的不同单词数量。
- `masteredWords`: 当日新掌握单词数量。
- `practiceRounds`: 当日完成练习轮数。

第一阶段是否必须做：

- 不是必须。
- 如果想快速做首页“今日新增”，可以先依赖 word 的 `createdAt` 计算。
- 如果想显示“今日练习 / 今日掌握”，再引入 dailyStats 会更方便。

## 八、掌握状态如何判断

建议第一版掌握规则保持简单：

1. 连续正确 2 次可以算作初步掌握。
2. 错词练习中连续正确 2 次，可以从错词状态中移出。
3. `correctStreak` 是判断掌握的过程字段。
4. `mastered` 是最终展示和统计字段。
5. 一旦答错：
   - `correctStreak` 重置为 0。
   - `mastered` 可以保持 true 或重置为 false，这一点后续需要产品规则确认。

建议第一阶段规则：

- `correctStreak >= 2` 时，设置 `mastered: true`，并记录 `masteredAt`。
- 如果已掌握后再次答错，先将 `correctStreak` 重置为 0，但暂不立刻取消 `mastered`。
- 不要一开始设计复杂算法、遗忘曲线或间隔重复。

## 九、首页统计如何计算

以后首页可以显示：

1. 累计词汇
   - 来源：所有 library 的 `words.length` 总和。

2. 今日新增
   - 来源：word 的 `createdAt` 是否为今天。
   - 后续也可以来源于 `dailyStats.addedWords`。

3. 当前错词
   - 方案 B 下来源：`words.filter(word => word.inWrongBook || word.wrongRoundCount > 0 && !word.mastered)`。
   - 如果兼容旧数据，也可以临时从 `wrongWords.length` 计算。

4. 已掌握词数
   - 来源：`words.filter(word => word.mastered).length`。

5. 已创建词库
   - 来源：`libraries.length`。

6. 最近练习时间
   - 来源：library 的 `lastPracticedAt` 最大值。
   - 后续也可以来源于 practiceHistory 的最新 `endedAt`。

## 十、数据迁移方案

目标：不要破坏用户现有 localStorage 数据。

建议迁移策略：

1. 老 word 没有 id 怎么补
   - 为每个旧 word 生成 `word-${Date.now()}-${random}`。
   - 同一轮迁移中要保证不重复。

2. 老 word 没有 createdAt 怎么处理
   - 如果没有历史创建时间，只能补当前迁移时间。
   - 可以额外加 `migratedAt`，说明这是迁移补充，不是真实创建时间。

3. wrongWords 旧数据怎么合并
   - 用 `english` 匹配同一 library 下的 word。
   - 匹配成功就把 `wrongCount` 合并为 `wrongRoundCount`。
   - `correctStreak` 取旧值。
   - 标记 `inWrongBook: true`。
   - 匹配失败就创建新 word，避免错词丢失。

4. 不要破坏旧数据
   - 迁移前先判断是否已经是 V2，避免重复迁移。
   - 可以在 localStorage 增加版本 key，例如 `ieltsTypingLearnerDataVersion = "2"`。
   - 第一阶段可以保留旧 `wrongWords` 字段，等所有页面都稳定切换后再考虑清理。

## 十一、第一阶段必须做什么

最小可执行版本：

1. 给 word 补基础字段
   - `id`
   - `createdAt`
   - `updatedAt`
   - `practiceCount`
   - `correctCount`
   - `wrongRoundCount`
   - `correctStreak`
   - `lastPracticedAt`
   - `mastered`
   - `masteredAt`

2. 给 library 补基础字段
   - `createdAt`
   - `updatedAt`
   - `lastPracticedAt`
   - `totalPracticeRounds`

3. 兼容旧 `wrongWords`
   - 先迁移到 word 字段。
   - 暂时保留旧字段，避免现有页面立刻失效。

4. 练习结束时更新 word 统计
   - 更新 `practiceCount`
   - 更新 `correctCount`
   - 更新 `wrongRoundCount`
   - 更新 `correctStreak`
   - 更新 `mastered`
   - 更新 `lastPracticedAt`

5. 首页显示最小统计
   - 累计词汇
   - 今日新增
   - 当前错词
   - 已掌握词数
   - 已创建词库
   - 最近练习时间

## 十二、以后再做什么

1. `practiceHistory`
2. `dailyStats`
3. 复习曲线
4. 更复杂掌握算法
5. 图表统计
6. 更细的练习模式分析
7. 数据导入时的 V2 深度校验

## 十三、结论

下一步应该先做数据结构升级，再做首页统计。

原因：

1. 首页统计需要稳定数据来源。
2. 当前 V1 数据只能支持词库数、单词数、错词数这类浅统计。
3. 积累感需要 `createdAt`、`practiceCount`、`wrongRoundCount`、`mastered`、`lastPracticedAt` 等字段支撑。
4. 先升级数据结构，可以避免后续首页统计和练习记录反复返工。

在本地版 / 当前数据结构阶段，暂时不要做账号、云同步、支付、AI 批改或完整雅思模考。
