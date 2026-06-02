# IELTS Typing Learner

IELTS Typing Learner 是一个本地运行的雅思生词拼写练习工具，用来创建个人词库、录入生词、进行拼写练习，并集中复习错词。

## 技术栈

- HTML
- CSS
- JavaScript
- localStorage

这是纯前端本地网页应用，不需要后端、数据库或构建工具。

## 页面结构

- `index.html`：首页和主入口。
- `library.html`：我的词库，管理词库、单词、词库顺序，并进入普通练习或错词练习。
- `input.html`：录入单词，支持英文、中文和可选例句。
- `practice.html`：拼写练习页，普通进入练习当前词库单词；`practice.html?mode=wrong` 练习当前词库错词。
- `wrong.html`：错词复习页，只展示有错词的词库，并可移出错词或进入错词练习。
- `settings.html`：设置页，管理例句显示、练习顺序、本地数据导入导出和清空。
- `app.html`：旧功能备份页，暂时保留，不是当前主流程重点。
- `bulk.html`：批量导入页，暂时保留，不是当前主流程重点。

## 主要功能

- 创建、重命名、删除和切换词库。
- 调整词库上移 / 下移顺序。
- 录入英文、中文释义和例句。
- 普通拼写练习，支持随机或顺序练习。
- 自动记录错词到当前词库的 `wrongWords`。
- 错词复习页集中查看、练习和移出错词。
- 错词练习模式复用 `practice.html?mode=wrong`。
- 本地数据导出、导入和清空。

## 如何本地打开

1. 打开项目目录。
2. 直接用浏览器打开 `index.html`。
3. 也可以使用 VS Code Live Server 打开 `index.html`。

所有数据保存在当前浏览器的 localStorage 中。更换浏览器或清空浏览器数据会影响本地词库。

## 当前开发注意事项

- 每次只做一个小功能。
- 开始修改前先执行 `git status`。
- 如果工作区不是 clean，先说明未提交文件，不要回滚已有改动。
- 不要修改 `app.html` / `bulk.html`，除非任务明确要求。
- 不要引入 React、Vue、Node、数据库或后端。
- 不要重写项目，优先沿用现有 HTML/CSS/JavaScript 结构。
- 样式复用 `style.css`，新增样式应少量且贴近现有结构。
- 更详细的项目状态见 `PROJECT_STATUS.md`。
