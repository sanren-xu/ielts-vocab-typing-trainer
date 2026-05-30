const LIBRARIES_STORAGE_KEY = "ieltsTypingLearnerLibraries";
const CURRENT_LIBRARY_ID_KEY = "ieltsTypingLearnerCurrentLibraryId";
const LEGACY_WORDS_STORAGE_KEY = "ieltsTypingLearnerWords";

const libraryNameInput = document.querySelector("#libraryNameInput");
const createLibraryBtn = document.querySelector("#createLibraryBtn");
const exportCurrentBtn = document.querySelector("#exportCurrentBtn");
const exportAllBtn = document.querySelector("#exportAllBtn");
const importLibraryBtn = document.querySelector("#importLibraryBtn");
const importFileInput = document.querySelector("#importFileInput");
const libraryList = document.querySelector("#libraryList");
const activeLibraryName = document.querySelector("#activeLibraryName");
const activeLibraryNameForInput = document.querySelector("#activeLibraryNameForInput");

const quickEnglishInput = document.querySelector("#quickEnglishInput");
const quickChineseInput = document.querySelector("#quickChineseInput");
const quickAddBtn = document.querySelector("#quickAddBtn");
const wordInput = document.querySelector("#wordInput");
const generateBtn = document.querySelector("#generateBtn");
const clearInputBtn = document.querySelector("#clearInputBtn");
const inputMessage = document.querySelector("#inputMessage");
const wordList = document.querySelector("#wordList");
const emptyText = document.querySelector("#emptyText");
const totalCount = document.querySelector("#totalCount");
const clearLibraryBtn = document.querySelector("#clearLibraryBtn");

const startBtn = document.querySelector("#startBtn");
const wrongOnlyBtn = document.querySelector("#wrongOnlyBtn");
const practiceSection = document.querySelector("#practiceSection");
const submitBtn = document.querySelector("#submitBtn");
const showAnswerBtn = document.querySelector("#showAnswerBtn");
const resetStatsBtn = document.querySelector("#resetStatsBtn");
const answerInput = document.querySelector("#answerInput");
const meaningText = document.querySelector("#meaningText");
const hintText = document.querySelector("#hintText");
const feedbackText = document.querySelector("#feedbackText");
const correctCount = document.querySelector("#correctCount");
const wrongCount = document.querySelector("#wrongCount");
const doneCount = document.querySelector("#doneCount");
const roundCount = document.querySelector("#roundCount");
const progressCount = document.querySelector("#progressCount");
const roundResult = document.querySelector("#roundResult");
const roundTotalCount = document.querySelector("#roundTotalCount");
const roundCorrectCount = document.querySelector("#roundCorrectCount");
const roundWrongCount = document.querySelector("#roundWrongCount");
const roundWrongWordCount = document.querySelector("#roundWrongWordCount");
const practiceAgainBtn = document.querySelector("#practiceAgainBtn");
const practiceWrongAgainBtn = document.querySelector("#practiceWrongAgainBtn");
const wrongBookToggleBtn = document.querySelector("#wrongBookToggleBtn");
const wrongBookList = document.querySelector("#wrongBookList");
const wrongBookCount = document.querySelector("#wrongBookCount");
const emptyWrongBookText = document.querySelector("#emptyWrongBookText");
const appModal = document.querySelector("#appModal");
const modalDialog = document.querySelector("#modalDialog");
const modalTitle = document.querySelector("#modalTitle");
const modalDescription = document.querySelector("#modalDescription");
const modalFields = document.querySelector("#modalFields");
const modalError = document.querySelector("#modalError");
const modalCancelBtn = document.querySelector("#modalCancelBtn");
const modalConfirmBtn = document.querySelector("#modalConfirmBtn");

let libraries = loadLibraries();
let currentLibraryId = loadCurrentLibraryId();
let words = getCurrentWords();
let currentWord = null;
let currentAttemptCount = 0;
let answerRevealed = false;
let currentPracticeMode = "all";
let wrongBookExpanded = false;
let practiceQueue = [];
let practiceSourceWords = [];
let practiceIndex = 0;
let currentRound = 0;
let roundStats = createEmptyRoundStats();
let activeModal = null;
let stats = {
  correct: 0,
  wrong: 0,
  done: 0
};

renderLibraryList();
renderCurrentLibrary();
renderStats();
renderPracticeProgress();
setPracticeEnabled(false);

createLibraryBtn.addEventListener("click", createLibrary);
exportCurrentBtn.addEventListener("click", exportCurrentLibrary);
exportAllBtn.addEventListener("click", exportAllLibraries);
importLibraryBtn.addEventListener("click", () => importFileInput.click());
importFileInput.addEventListener("change", importLibrariesFromFile);

libraryNameInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    createLibrary();
  }
});

quickAddBtn.addEventListener("click", addQuickWord);

quickEnglishInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    quickChineseInput.focus();
  }
});

quickChineseInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    addQuickWord();
  }
});

generateBtn.addEventListener("click", () => {
  const parsedWords = parseWords(wordInput.value);

  if (parsedWords.length === 0) {
    showInputMessage("没有识别到有效单词，请使用“英文 - 中文意思”等格式。", "error");
    return;
  }

  addWordsToCurrentLibrary(parsedWords);
});

clearInputBtn.addEventListener("click", () => {
  wordInput.value = "";
  quickEnglishInput.value = "";
  quickChineseInput.value = "";
  showInputMessage("输入框已清空。");
  quickEnglishInput.focus();
});

clearLibraryBtn.addEventListener("click", async () => {
  if (words.length === 0) {
    showInputMessage("当前词库已经是空的。");
    return;
  }

  const confirmed = await openModal({
    title: "清空当前词库",
    description: `确定要清空“${getCurrentLibrary().name}”里的所有单词和错词记录吗？这个操作不能撤销。`,
    confirmText: "清空词库",
    variant: "danger"
  });

  if (!confirmed) {
    return;
  }

  words = [];
  currentWord = null;
  getCurrentLibrary().wrongWords = [];
  saveCurrentWords(words);
  renderCurrentLibrary();
  renderLibraryList();
  hidePracticeSection();
  showInputMessage("当前词库已清空。");
});

startBtn.addEventListener("click", () => {
  if (words.length === 0) {
    showInputMessage("请先给当前词库添加单词，再开始练习。", "error");
    return;
  }

  startPractice(words, "全部单词", "all");
});

wrongOnlyBtn.addEventListener("click", () => {
  startWrongWordsPractice();
});

practiceAgainBtn.addEventListener("click", () => {
  if (words.length === 0) {
    showInputMessage("请先给当前词库添加单词，再开始练习。", "error");
    return;
  }

  startPractice(words, "全部单词", "all");
});

practiceWrongAgainBtn.addEventListener("click", startWrongWordsPractice);
showAnswerBtn.addEventListener("click", showCurrentAnswer);
wrongBookToggleBtn.addEventListener("click", () => {
  wrongBookExpanded = !wrongBookExpanded;
  renderWrongBook();
});

modalCancelBtn.addEventListener("click", closeModal);

appModal.addEventListener("click", (event) => {
  if (event.target === appModal) {
    closeModal();
  }
});

modalDialog.addEventListener("submit", (event) => {
  event.preventDefault();
  confirmModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && activeModal) {
    closeModal();
  }
});

submitBtn.addEventListener("click", checkAnswer);

answerInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    checkAnswer();
  }
});

resetStatsBtn.addEventListener("click", () => {
  resetStats();
  feedbackText.textContent = "统计已重置，可以继续练习。";
  feedbackText.className = "feedback";
});

function createLibrary() {
  const name = libraryNameInput.value.trim();

  if (!name) {
    showInputMessage("请先输入词库名称。", "error");
    libraryNameInput.focus();
    return;
  }

  const duplicated = libraries.some((library) => library.name === name);

  if (duplicated) {
    showInputMessage("这个词库名称已经存在，请换一个名称。", "error");
    libraryNameInput.focus();
    return;
  }

  const newLibrary = {
    id: createLibraryId(),
    name,
    words: [],
    wrongWords: []
  };

  libraries.push(newLibrary);
  currentLibraryId = newLibrary.id;
  words = newLibrary.words;
  libraryNameInput.value = "";
  saveLibraries();
  saveCurrentLibraryId();
  hidePracticeSection();
  resetStats();
  renderLibraryList();
  renderCurrentLibrary();
  showInputMessage(`已创建并切换到“${name}”。`, "success");
}

function switchLibrary(libraryId) {
  if (currentLibraryId === libraryId) {
    return;
  }

  currentLibraryId = libraryId;
  words = getCurrentWords();
  saveCurrentLibraryId();
  hidePracticeSection();
  resetStats();
  renderLibraryList();
  renderCurrentLibrary();
  showInputMessage(`已切换到“${getCurrentLibrary().name}”。`);
}

function addQuickWord() {
  const english = quickEnglishInput.value.trim().toLowerCase();
  const chinese = normalizeChineseMeaning(quickChineseInput.value);

  if (!english) {
    showInputMessage("请先输入英文单词。", "error");
    quickEnglishInput.focus();
    return;
  }

  if (!chinese) {
    showInputMessage("请填写中文意思。", "error");
    quickChineseInput.focus();
    return;
  }

  const result = addWordsToCurrentLibrary([
    {
      english,
      chinese
    }
  ]);

  if (result.added > 0) {
    quickEnglishInput.value = "";
    quickChineseInput.value = "";
    quickEnglishInput.focus();
  }
}

function addWordsToCurrentLibrary(newWords) {
  const result = mergeWords(words, newWords);
  words = result.words;
  saveCurrentWords(words);
  renderCurrentLibrary();
  renderLibraryList();

  const messages = [];

  if (result.added > 0) {
    messages.push(`已添加 ${result.added} 个单词`);
  }

  if (result.skipped > 0) {
    messages.push(`跳过 ${result.skipped} 个重复单词`);
  }

  showInputMessage(`${messages.join("，")}。当前共有 ${words.length} 个单词。`, result.added > 0 ? "success" : "error");
  return result;
}

function parseWords(text) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split(/\s*(?:\t|[-—–：:=])\s*/);

      if (parts.length < 2) {
        return null;
      }

      const english = parts[0].trim().toLowerCase();
      const chinese = normalizeChineseMeaning(parts.slice(1).join(" "));

      if (!english || !chinese) {
        return null;
      }

      return {
        english,
        chinese
      };
    })
    .filter(Boolean);
}

function mergeWords(oldWords, newWords) {
  const wordMap = new Map();
  let added = 0;
  let skipped = 0;

  // 用英文单词当作唯一标识，重复录入时跳过。
  oldWords.forEach((item) => wordMap.set(item.english, item));
  newWords.forEach((item) => {
    if (wordMap.has(item.english)) {
      skipped += 1;
      return;
    }

    wordMap.set(item.english, item);
    added += 1;
  });

  return {
    words: Array.from(wordMap.values()).sort((a, b) => a.english.localeCompare(b.english)),
    added,
    skipped
  };
}

function normalizeChineseMeaning(text) {
  return text
    .split(/[；;，,、/|｜]+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .join("；");
}

function renderLibraryList() {
  libraryList.innerHTML = "";

  libraries.forEach((library) => {
    const item = document.createElement("li");
    item.className = library.id === currentLibraryId ? "library-item active" : "library-item";

    const name = document.createElement("span");
    name.textContent = library.name;

    const count = document.createElement("small");
    count.textContent = `${library.words.length} 个单词`;

    const switchButton = document.createElement("button");
    switchButton.className = library.id === currentLibraryId ? "library-switch active" : "library-switch";
    switchButton.type = "button";
    switchButton.addEventListener("click", () => switchLibrary(library.id));
    switchButton.append(name, count);

    const actions = document.createElement("div");
    actions.className = "library-actions";

    const renameButton = document.createElement("button");
    renameButton.className = "library-action-btn rename-library-btn";
    renameButton.type = "button";
    renameButton.textContent = "重命名";
    renameButton.addEventListener("click", () => renameLibrary(library.id));

    const deleteButton = document.createElement("button");
    deleteButton.className = "library-action-btn delete-library-btn";
    deleteButton.type = "button";
    deleteButton.textContent = "删除";
    deleteButton.disabled = libraries.length === 1;
    deleteButton.addEventListener("click", () => deleteLibrary(library.id));

    actions.append(renameButton, deleteButton);
    item.append(switchButton, actions);
    libraryList.appendChild(item);
  });
}

async function renameLibrary(libraryId) {
  const library = libraries.find((item) => item.id === libraryId);

  if (!library) {
    return;
  }

  const result = await openModal({
    title: "重命名词库",
    description: "请输入新的词库名称。",
    confirmText: "保存名称",
    fields: [
      {
        id: "name",
        label: "词库名称",
        value: library.name,
        required: true
      }
    ]
  });

  if (!result) {
    return;
  }

  const cleanedName = result.name.trim();

  const duplicated = libraries.some((item) => item.id !== libraryId && item.name === cleanedName);

  if (duplicated) {
    showInputMessage("这个词库名称已经存在，请换一个名称。", "error");
    return;
  }

  library.name = cleanedName;
  saveLibraries();
  renderLibraryList();
  renderCurrentLibrary();
  showInputMessage(`词库已重命名为“${cleanedName}”。`, "success");
}

async function deleteLibrary(libraryId) {
  const library = libraries.find((item) => item.id === libraryId);

  if (!library) {
    return;
  }

  if (libraries.length === 1) {
    showInputMessage("至少需要保留一个词库。", "error");
    return;
  }

  const confirmed = await openModal({
    title: "删除词库",
    description: `确定要删除“${library.name}”吗？里面的单词和错词记录也会一起删除。`,
    confirmText: "删除词库",
    variant: "danger"
  });

  if (!confirmed) {
    return;
  }

  const deletedCurrentLibrary = libraryId === currentLibraryId;
  libraries = libraries.filter((item) => item.id !== libraryId);

  if (deletedCurrentLibrary) {
    currentLibraryId = libraries[0].id;
    words = getCurrentWords();
    saveCurrentLibraryId();
    hidePracticeSection();
    resetStats();
  }

  saveLibraries();
  renderLibraryList();
  renderCurrentLibrary();

  const currentName = getCurrentLibrary().name;
  showInputMessage(deletedCurrentLibrary ? `词库已删除，已切换到“${currentName}”。` : `已删除“${library.name}”。`, "success");
}

function exportCurrentLibrary() {
  const currentLibrary = getCurrentLibrary();
  const exportData = normalizeLibrary(currentLibrary);
  downloadJson(exportData, `${safeFileName(currentLibrary.name)}.json`);
  showInputMessage(`已导出“${currentLibrary.name}”。`, "success");
}

function exportAllLibraries() {
  const exportData = {
    app: "ielts-typing-learner",
    version: 1,
    libraries: libraries.map(normalizeLibrary)
  };

  downloadJson(exportData, "ielts-typing-learner-libraries.json");
  showInputMessage("已导出全部词库。", "success");
}

function importLibrariesFromFile(event) {
  const file = event.target.files[0];
  event.target.value = "";

  if (!file) {
    return;
  }

  const reader = new FileReader();

  reader.addEventListener("load", () => {
    try {
      const parsedData = JSON.parse(reader.result);
      const importedLibraries = parseImportedLibraries(parsedData);

      if (importedLibraries.length === 0) {
        throw new Error("没有可导入的词库。");
      }

      const existingNames = new Set(libraries.map((library) => library.name));
      const normalizedLibraries = importedLibraries.map((library) => {
        const uniqueName = createCopyName(library.name, existingNames);
        existingNames.add(uniqueName);

        return {
          ...library,
          id: createLibraryId(),
          name: uniqueName
        };
      });

      libraries.push(...normalizedLibraries);
      currentLibraryId = normalizedLibraries[normalizedLibraries.length - 1].id;
      words = getCurrentWords();
      saveLibraries();
      saveCurrentLibraryId();
      hidePracticeSection();
      resetStats();
      renderLibraryList();
      renderCurrentLibrary();
      showInputMessage(`已导入 ${normalizedLibraries.length} 个词库。`, "success");
    } catch {
      showInputMessage("导入失败：JSON 格式不正确或词库数据无效。", "error");
    }
  });

  reader.addEventListener("error", () => {
    showInputMessage("导入失败：无法读取文件。", "error");
  });

  reader.readAsText(file);
}

function renderCurrentLibrary() {
  const currentLibrary = getCurrentLibrary();
  words = currentLibrary.words;
  activeLibraryName.textContent = currentLibrary.name;
  activeLibraryNameForInput.textContent = currentLibrary.name;
  renderWordList();
  renderWrongBook();
}

function renderWordList() {
  wordList.innerHTML = "";
  totalCount.textContent = words.length;
  emptyText.hidden = words.length > 0;
  startBtn.disabled = words.length === 0;
  clearLibraryBtn.disabled = words.length === 0;

  words.forEach((word) => {
    const item = document.createElement("li");
    item.className = "word-item";

    const english = document.createElement("strong");
    english.textContent = word.english;

    const chinese = document.createElement("span");
    chinese.textContent = word.chinese;

    const buttonGroup = document.createElement("div");
    buttonGroup.className = "word-actions";

    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn";
    editBtn.textContent = "编辑";
    editBtn.addEventListener("click", () => editWord(word.english));

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "删除";
    deleteBtn.addEventListener("click", () => deleteWord(word.english));

    buttonGroup.append(editBtn, deleteBtn);
    item.append(english, chinese, buttonGroup);
    wordList.appendChild(item);
  });
}

async function editWord(oldEnglish) {
  const oldWord = words.find((word) => word.english === oldEnglish);

  if (!oldWord) {
    return;
  }

  const result = await openModal({
    title: "编辑单词",
    description: "修改当前词条的英文单词和中文意思。",
    confirmText: "保存修改",
    fields: [
      {
        id: "english",
        label: "英文单词",
        value: oldWord.english,
        required: true
      },
      {
        id: "chinese",
        label: "中文意思",
        value: oldWord.chinese,
        required: true
      }
    ]
  });

  if (!result) {
    return;
  }

  const cleanedEnglish = result.english.trim().toLowerCase();
  const cleanedChinese = result.chinese.trim();

  // 编辑时只在当前词库内去重，不影响其他词库。
  words = words.filter((word) => word.english !== oldEnglish && word.english !== cleanedEnglish);
  words.push({
    english: cleanedEnglish,
    chinese: cleanedChinese
  });
  words.sort((a, b) => a.english.localeCompare(b.english));

  if (currentWord && currentWord.english === oldEnglish) {
    currentWord = {
      english: cleanedEnglish,
      chinese: cleanedChinese
    };
    meaningText.textContent = currentWord.chinese;
    hintText.textContent = createHint(currentWord.english);
  }

  updatePracticeQueueWord(oldEnglish, {
    english: cleanedEnglish,
    chinese: cleanedChinese
  });
  updateWrongBookWord(oldEnglish, {
    english: cleanedEnglish,
    chinese: cleanedChinese
  });

  saveCurrentWords(words);
  renderCurrentLibrary();
  renderLibraryList();
}

function deleteWord(english) {
  const deletedCurrentWord = currentWord && currentWord.english === english;

  words = words.filter((word) => word.english !== english);
  removeWordFromPracticeQueue(english);
  removeWrongBookWord(english);
  saveCurrentWords(words);
  renderCurrentLibrary();
  renderLibraryList();

  if (words.length === 0) {
    hidePracticeSection();
  }

  if (deletedCurrentWord) {
    currentWord = null;
    if (words.length > 0 && !practiceSection.hidden) {
      pickNextWord();
    }
  }
}

function hidePracticeSection() {
  practiceSection.hidden = true;
  setPracticeEnabled(false);
  currentWord = null;
  currentAttemptCount = 0;
  answerRevealed = false;
  resetPracticeQueue();
  exitPracticeMode();
  hideRoundResult();
  showAnswerBtn.hidden = true;
  answerInput.value = "";
  meaningText.textContent = "请先点击开始练习";
  hintText.textContent = "_";
  feedbackText.textContent = "请输入这个单词的完整英文拼写。";
  feedbackText.className = "feedback";
}

function startPractice(sourceWords, modeName, modeType = "all") {
  enterPracticeMode();
  currentPracticeMode = modeType;
  practiceSection.hidden = false;
  setPracticeEnabled(true);
  hideRoundResult();
  startPracticeQueue(sourceWords, modeName);
  pickNextWord();
  practiceSection.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function startWrongWordsPractice() {
  const wrongWords = getCurrentWrongWords();

  if (wrongWords.length === 0) {
    showPracticeMessage("当前词库暂无错词。", "error");
    return;
  }

  startPractice(wrongWords, "错词", "wrong");
}

function startPracticeQueue(sourceWords, modeName) {
  practiceSourceWords = sourceWords.map((word) => ({ ...word }));
  practiceQueue = shuffleWords(practiceSourceWords);
  practiceIndex = 0;
  currentRound += 1;
  roundStats = createEmptyRoundStats(practiceQueue.length);
  feedbackText.textContent = `正在练习：${modeName}。`;
  feedbackText.className = "feedback";
  renderPracticeProgress();
}

function pickNextWord() {
  if (practiceSourceWords.length === 0) {
    hidePracticeSection();
    return;
  }

  if (practiceIndex >= practiceQueue.length) {
    showRoundComplete();
    return;
  }

  currentWord = practiceQueue[practiceIndex];
  practiceIndex += 1;
  currentAttemptCount = 0;
  answerRevealed = false;
  answerInput.value = "";
  showAnswerBtn.hidden = true;
  meaningText.textContent = currentWord.chinese;
  hintText.textContent = createHint(currentWord.english);
  feedbackText.textContent = "请输入这个单词的完整英文拼写。";
  feedbackText.className = "feedback";
  renderPracticeProgress();
  answerInput.focus();
}

function shuffleWords(sourceWords) {
  const shuffledWords = sourceWords.map((word) => ({ ...word }));

  // Fisher-Yates 洗牌：每一轮先打乱，再按顺序出题。
  for (let index = shuffledWords.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffledWords[index], shuffledWords[randomIndex]] = [shuffledWords[randomIndex], shuffledWords[index]];
  }

  return shuffledWords;
}

function resetPracticeQueue() {
  practiceQueue = [];
  practiceSourceWords = [];
  practiceIndex = 0;
  currentRound = 0;
  roundStats = createEmptyRoundStats();
  renderPracticeProgress();
}

function renderPracticeProgress() {
  roundCount.textContent = currentRound;
  progressCount.textContent = `${Math.min(practiceIndex, practiceQueue.length)} / ${practiceQueue.length}`;
}

function createEmptyRoundStats(total = 0) {
  return {
    total,
    correct: 0,
    wrong: 0,
    wrongWords: new Set()
  };
}

function showRoundComplete() {
  currentWord = null;
  currentAttemptCount = 0;
  answerRevealed = false;
  exitPracticeMode();
  setPracticeEnabled(false);
  answerInput.value = "";
  showAnswerBtn.hidden = true;
  meaningText.textContent = "本轮完成";
  hintText.textContent = "_";
  feedbackText.textContent = "本轮完成，可以再练一轮，或只练错词。";
  feedbackText.className = "feedback correct";
  roundTotalCount.textContent = roundStats.total;
  roundCorrectCount.textContent = roundStats.correct;
  roundWrongCount.textContent = roundStats.wrong;
  roundWrongWordCount.textContent = roundStats.wrongWords.size;
  roundResult.hidden = false;
  renderPracticeProgress();
}

function hideRoundResult() {
  roundResult.hidden = true;
}

function enterPracticeMode() {
  document.body.classList.add("practice-active");
}

function exitPracticeMode() {
  document.body.classList.remove("practice-active");
}

function updatePracticeQueueWord(oldEnglish, updatedWord) {
  practiceSourceWords = practiceSourceWords.map((word) => {
    if (word.english !== oldEnglish) {
      return word;
    }

    return { ...word, ...updatedWord };
  });

  practiceQueue = practiceQueue.map((word) => {
    if (word.english !== oldEnglish) {
      return word;
    }

    return { ...word, ...updatedWord };
  });
  renderPracticeProgress();
}

function removeWordFromPracticeQueue(english) {
  practiceSourceWords = practiceSourceWords.filter((word) => word.english !== english);

  const removedBeforeCurrentIndex = practiceQueue
    .slice(0, practiceIndex)
    .filter((word) => word.english === english).length;

  practiceQueue = practiceQueue.filter((word) => word.english !== english);
  practiceIndex = Math.max(0, practiceIndex - removedBeforeCurrentIndex);
  renderPracticeProgress();
}

function createHint(word) {
  if (word.length <= 1) {
    return word;
  }

  // 保留首字母，其余字母用下划线提示。
  return `${word[0]} ${Array(word.length - 1).fill("_").join(" ")}`;
}

function checkAnswer() {
  if (!currentWord) {
    feedbackText.textContent = "请先点击开始练习。";
    feedbackText.className = "feedback wrong";
    return;
  }

  const userAnswer = answerInput.value.trim().toLowerCase();

  if (!userAnswer) {
    feedbackText.textContent = "先输入你的答案，再提交。";
    feedbackText.className = "feedback wrong";
    answerInput.focus();
    return;
  }

  stats.done += 1;

  if (userAnswer === currentWord.english) {
    stats.correct += 1;
    roundStats.correct += 1;
    if (currentPracticeMode === "wrong") {
      markWrongWordCorrect(currentWord);
    }
    renderStats();
    feedbackText.textContent = practiceIndex >= practiceQueue.length ? "拼写正确，本轮完成。" : "拼写正确，进入下一题。";
    feedbackText.className = "feedback correct";

    setTimeout(() => {
      if (!practiceSection.hidden) {
        pickNextWord();
      }
    }, 650);
    return;
  }

  stats.wrong += 1;
  roundStats.wrong += 1;
  roundStats.wrongWords.add(currentWord.english);
  currentAttemptCount += 1;
  addWrongWord(currentWord);
  renderStats();
  if (answerRevealed) {
    feedbackText.textContent = `还没有拼对，正确答案是：${currentWord.english}`;
  } else if (currentAttemptCount === 1) {
    feedbackText.textContent = "拼写错误，请再试一次。";
  } else if (currentAttemptCount === 2) {
    feedbackText.textContent = "请注意首字母和单词长度。";
  } else {
    feedbackText.textContent = "还没有拼对，可以查看答案后继续练习。";
    showAnswerBtn.hidden = false;
  }
  feedbackText.className = "feedback wrong";
  answerInput.select();
}

function showCurrentAnswer() {
  if (!currentWord) {
    return;
  }

  answerRevealed = true;
  showAnswerBtn.hidden = true;
  feedbackText.textContent = `正确答案是：${currentWord.english}。请重新输入正确拼写后进入下一题。`;
  feedbackText.className = "feedback wrong";
  answerInput.focus();
  answerInput.select();
}

function resetStats() {
  stats = {
    correct: 0,
    wrong: 0,
    done: 0
  };
  renderStats();
}

function renderStats() {
  correctCount.textContent = stats.correct;
  wrongCount.textContent = stats.wrong;
  doneCount.textContent = stats.done;
}

function addWrongWord(word) {
  const currentLibrary = getCurrentLibrary();
  const wrongWords = getCurrentWrongWords();
  const matchedWord = wrongWords.find((item) => item.english === word.english);

  if (matchedWord) {
    matchedWord.chinese = word.chinese;
    matchedWord.wrongCount += 1;
    matchedWord.correctStreak = 0;
  } else {
    wrongWords.push({
      english: word.english,
      chinese: word.chinese,
      wrongCount: 1,
      correctStreak: 0
    });
  }

  wrongWords.sort((a, b) => b.wrongCount - a.wrongCount || a.english.localeCompare(b.english));
  currentLibrary.wrongWords = wrongWords;
  saveLibraries();
  renderWrongBook();
}

function renderWrongBook() {
  const wrongWords = getCurrentWrongWords();
  wrongBookList.innerHTML = "";
  wrongBookCount.textContent = `${wrongWords.length} 个错词`;
  wrongBookToggleBtn.textContent = wrongBookExpanded ? "收起错词本" : "查看错词本";
  wrongBookList.hidden = !wrongBookExpanded || wrongWords.length === 0;
  emptyWrongBookText.hidden = !wrongBookExpanded || wrongWords.length > 0;

  wrongWords.forEach((word) => {
    const item = document.createElement("li");
    item.className = "wrong-book-item";

    const english = document.createElement("strong");
    english.textContent = word.english;

    const chinese = document.createElement("span");
    chinese.textContent = word.chinese;

    const count = document.createElement("small");
    count.textContent = `错误 ${word.wrongCount} 次，连续正确 ${word.correctStreak || 0} 次`;

    item.append(english, chinese, count);
    wrongBookList.appendChild(item);
  });
}

function updateWrongBookWord(oldEnglish, updatedWord) {
  const currentLibrary = getCurrentLibrary();
  const wrongWordMap = new Map();

  getCurrentWrongWords().forEach((word) => {
    const english = word.english === oldEnglish ? updatedWord.english : word.english;
    const chinese = word.english === oldEnglish ? updatedWord.chinese : word.chinese;
    const existingWord = wrongWordMap.get(english);

    if (existingWord) {
      existingWord.chinese = chinese;
      existingWord.wrongCount += word.wrongCount;
      existingWord.correctStreak = Math.max(existingWord.correctStreak || 0, word.correctStreak || 0);
      return;
    }

    wrongWordMap.set(english, {
      english,
      chinese,
      wrongCount: word.wrongCount,
      correctStreak: word.correctStreak || 0
    });
  });

  currentLibrary.wrongWords = Array.from(wrongWordMap.values()).sort((a, b) => b.wrongCount - a.wrongCount || a.english.localeCompare(b.english));
  saveLibraries();
  renderWrongBook();
}

function markWrongWordCorrect(word) {
  const currentLibrary = getCurrentLibrary();
  const wrongWords = getCurrentWrongWords();
  const matchedWord = wrongWords.find((item) => item.english === word.english);

  if (!matchedWord) {
    return;
  }

  matchedWord.correctStreak = (matchedWord.correctStreak || 0) + 1;

  if (matchedWord.correctStreak >= 2) {
    currentLibrary.wrongWords = wrongWords.filter((item) => item.english !== word.english);
  } else {
    currentLibrary.wrongWords = wrongWords;
  }

  saveLibraries();
  renderWrongBook();
}

function removeWrongBookWord(english) {
  const currentLibrary = getCurrentLibrary();
  currentLibrary.wrongWords = getCurrentWrongWords().filter((word) => word.english !== english);
  saveLibraries();
  renderWrongBook();
}

function setPracticeEnabled(enabled) {
  answerInput.disabled = !enabled;
  submitBtn.disabled = !enabled;
}

function showInputMessage(text, type) {
  inputMessage.textContent = text;
  inputMessage.style.color = type === "error" ? "var(--danger)" : type === "success" ? "var(--success)" : "var(--muted)";
}

function showPracticeMessage(text, type) {
  showInputMessage(text, type);

  if (!practiceSection.hidden || document.body.classList.contains("practice-active")) {
    feedbackText.textContent = text;
    feedbackText.className = type === "error" ? "feedback wrong" : "feedback";
  }
}

function openModal(options) {
  const {
    title,
    description,
    fields = [],
    confirmText = "确认",
    cancelText = "取消",
    variant = "default"
  } = options;

  modalTitle.textContent = title;
  modalDescription.textContent = description;
  modalConfirmBtn.textContent = confirmText;
  modalCancelBtn.textContent = cancelText;
  modalConfirmBtn.className = variant === "danger" ? "modal-confirm-danger" : "primary-btn";
  modalError.hidden = true;
  modalError.textContent = "";
  modalFields.innerHTML = "";

  fields.forEach((field) => {
    const fieldWrap = document.createElement("div");
    fieldWrap.className = "modal-field";

    const label = document.createElement("label");
    label.setAttribute("for", `modal-field-${field.id}`);
    label.textContent = field.label;

    const input = document.createElement("input");
    input.id = `modal-field-${field.id}`;
    input.name = field.id;
    input.type = field.type || "text";
    input.value = field.value || "";
    input.placeholder = field.placeholder || "";
    input.dataset.required = field.required ? "true" : "false";

    fieldWrap.append(label, input);
    modalFields.appendChild(fieldWrap);
  });

  appModal.hidden = false;

  const firstInput = modalFields.querySelector("input");
  if (firstInput) {
    firstInput.focus();
    firstInput.select();
  } else {
    modalConfirmBtn.focus();
  }

  return new Promise((resolve) => {
    activeModal = {
      fields,
      resolve
    };
  });
}

function confirmModal() {
  if (!activeModal) {
    return;
  }

  const values = {};

  for (const field of activeModal.fields) {
    const input = modalFields.querySelector(`[name="${field.id}"]`);
    const value = input ? input.value.trim() : "";

    if (field.required && !value) {
      showModalError(`${field.label}不能为空。`);
      input?.focus();
      return;
    }

    values[field.id] = value;
  }

  const result = activeModal.fields.length > 0 ? values : true;
  const resolver = activeModal.resolve;
  activeModal = null;
  appModal.hidden = true;
  resolver(result);
}

function closeModal() {
  if (!activeModal) {
    return;
  }

  const resolver = activeModal.resolve;
  activeModal = null;
  appModal.hidden = true;
  resolver(null);
}

function showModalError(message) {
  modalError.textContent = message;
  modalError.hidden = false;
}

function getCurrentLibrary() {
  const matchedLibrary = libraries.find((library) => library.id === currentLibraryId);

  if (matchedLibrary) {
    return matchedLibrary;
  }

  currentLibraryId = libraries[0].id;
  saveCurrentLibraryId();
  return libraries[0];
}

function getCurrentWords() {
  return getCurrentLibrary().words;
}

function getCurrentWrongWords() {
  const currentLibrary = getCurrentLibrary();

  if (!Array.isArray(currentLibrary.wrongWords)) {
    currentLibrary.wrongWords = [];
  }

  return currentLibrary.wrongWords;
}

function saveCurrentWords(newWords) {
  const currentLibrary = getCurrentLibrary();
  currentLibrary.words = newWords;
  words = currentLibrary.words;
  saveLibraries();
}

function saveLibraries() {
  localStorage.setItem(LIBRARIES_STORAGE_KEY, JSON.stringify(libraries));
}

function saveCurrentLibraryId() {
  localStorage.setItem(CURRENT_LIBRARY_ID_KEY, currentLibraryId);
}

function loadCurrentLibraryId() {
  const savedId = localStorage.getItem(CURRENT_LIBRARY_ID_KEY);
  const matchedLibrary = libraries.find((library) => library.id === savedId);

  if (matchedLibrary) {
    return matchedLibrary.id;
  }

  return libraries[0].id;
}

function loadLibraries() {
  const savedLibraries = localStorage.getItem(LIBRARIES_STORAGE_KEY);

  if (savedLibraries) {
    try {
      const parsedLibraries = JSON.parse(savedLibraries);

      if (Array.isArray(parsedLibraries) && parsedLibraries.length > 0) {
        return parsedLibraries.map(normalizeLibrary);
      }
    } catch {
      return createDefaultLibraries();
    }
  }

  return createDefaultLibraries();
}

function createDefaultLibraries() {
  const legacyWords = loadLegacyWords();
  const defaultLibrary = {
    id: createLibraryId(),
    name: "默认词库",
    words: legacyWords,
    wrongWords: []
  };

  localStorage.setItem(LIBRARIES_STORAGE_KEY, JSON.stringify([defaultLibrary]));
  return [defaultLibrary];
}

function loadLegacyWords() {
  const savedWords = localStorage.getItem(LEGACY_WORDS_STORAGE_KEY);

  if (!savedWords) {
    return [];
  }

  try {
    const parsedWords = JSON.parse(savedWords);
    return Array.isArray(parsedWords) ? parsedWords : [];
  } catch {
    return [];
  }
}

function normalizeLibrary(library) {
  return {
    id: library.id || createLibraryId(),
    name: library.name || "未命名词库",
    words: Array.isArray(library.words) ? library.words : [],
    wrongWords: Array.isArray(library.wrongWords) ? library.wrongWords.map(normalizeWrongWord) : []
  };
}

function parseImportedLibraries(data) {
  if (!data || typeof data !== "object") {
    throw new Error("JSON 根数据必须是对象或数组。");
  }

  const rawLibraries = Array.isArray(data) ? data : Array.isArray(data.libraries) ? data.libraries : [data];

  return rawLibraries.map(validateImportedLibrary);
}

function validateImportedLibrary(library) {
  if (!library || typeof library !== "object" || Array.isArray(library)) {
    throw new Error("词库必须是对象。");
  }

  const name = typeof library.name === "string" ? library.name.trim() : "";

  if (!name || !Array.isArray(library.words)) {
    throw new Error("词库缺少名称或单词列表。");
  }

  return {
    id: createLibraryId(),
    name,
    words: library.words.map(validateImportedWord),
    wrongWords: Array.isArray(library.wrongWords) ? library.wrongWords.map(validateImportedWrongWord) : []
  };
}

function validateImportedWord(word) {
  if (!word || typeof word !== "object" || Array.isArray(word)) {
    throw new Error("单词必须是对象。");
  }

  const english = typeof word.english === "string" ? word.english.trim().toLowerCase() : "";
  const chinese = typeof word.chinese === "string" ? word.chinese.trim() : "";

  if (!english || !chinese) {
    throw new Error("单词缺少英文或中文意思。");
  }

  return {
    english,
    chinese
  };
}

function validateImportedWrongWord(word) {
  const normalizedWord = normalizeWrongWord(validateImportedWord(word));
  const wrongCount = Number(word.wrongCount);
  const correctStreak = Number(word.correctStreak);

  return {
    ...normalizedWord,
    wrongCount: Number.isFinite(wrongCount) && wrongCount > 0 ? wrongCount : 1,
    correctStreak: Number.isFinite(correctStreak) && correctStreak > 0 ? correctStreak : 0
  };
}

function normalizeWrongWord(word = {}) {
  const safeWord = word || {};

  return {
    english: safeWord.english || "",
    chinese: safeWord.chinese || "",
    wrongCount: Number.isFinite(safeWord.wrongCount) && safeWord.wrongCount > 0 ? safeWord.wrongCount : 1,
    correctStreak: Number.isFinite(safeWord.correctStreak) && safeWord.correctStreak > 0 ? safeWord.correctStreak : 0
  };
}

function createLibraryId() {
  return `library-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createCopyName(baseName, existingNames = new Set(libraries.map((library) => library.name))) {
  let candidateName = existingNames.has(baseName) ? `${baseName} 副本` : baseName;
  let copyIndex = 2;

  while (existingNames.has(candidateName)) {
    candidateName = `${baseName} 副本 ${copyIndex}`;
    copyIndex += 1;
  }

  return candidateName;
}

function downloadJson(data, fileName) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function safeFileName(name) {
  return name.replace(/[\\/:*?"<>|]/g, "_").trim() || "ielts-library";
}
