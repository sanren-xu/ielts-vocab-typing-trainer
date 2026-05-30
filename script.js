const LIBRARIES_STORAGE_KEY = "ieltsTypingLearnerLibraries";
const CURRENT_LIBRARY_ID_KEY = "ieltsTypingLearnerCurrentLibraryId";
const LEGACY_WORDS_STORAGE_KEY = "ieltsTypingLearnerWords";

const libraryNameInput = document.querySelector("#libraryNameInput");
const createLibraryBtn = document.querySelector("#createLibraryBtn");
const libraryList = document.querySelector("#libraryList");
const activeLibraryName = document.querySelector("#activeLibraryName");
const activeLibraryNameForInput = document.querySelector("#activeLibraryNameForInput");

const wordInput = document.querySelector("#wordInput");
const generateBtn = document.querySelector("#generateBtn");
const clearInputBtn = document.querySelector("#clearInputBtn");
const inputMessage = document.querySelector("#inputMessage");
const wordList = document.querySelector("#wordList");
const emptyText = document.querySelector("#emptyText");
const totalCount = document.querySelector("#totalCount");
const clearLibraryBtn = document.querySelector("#clearLibraryBtn");

const startBtn = document.querySelector("#startBtn");
const practiceSection = document.querySelector("#practiceSection");
const submitBtn = document.querySelector("#submitBtn");
const resetStatsBtn = document.querySelector("#resetStatsBtn");
const answerInput = document.querySelector("#answerInput");
const meaningText = document.querySelector("#meaningText");
const hintText = document.querySelector("#hintText");
const feedbackText = document.querySelector("#feedbackText");
const correctCount = document.querySelector("#correctCount");
const wrongCount = document.querySelector("#wrongCount");
const doneCount = document.querySelector("#doneCount");

let libraries = loadLibraries();
let currentLibraryId = loadCurrentLibraryId();
let words = getCurrentWords();
let currentWord = null;
let stats = {
  correct: 0,
  wrong: 0,
  done: 0
};

renderLibraryList();
renderCurrentLibrary();
renderStats();
setPracticeEnabled(false);

createLibraryBtn.addEventListener("click", createLibrary);

libraryNameInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    createLibrary();
  }
});

generateBtn.addEventListener("click", () => {
  const parsedWords = parseWords(wordInput.value);

  if (parsedWords.length === 0) {
    showInputMessage("没有识别到有效单词，请使用“英文 - 中文意思”的格式。", "error");
    return;
  }

  words = mergeWords(words, parsedWords);
  saveCurrentWords(words);
  renderCurrentLibrary();
  renderLibraryList();
  showInputMessage(`已添加到“${getCurrentLibrary().name}”，当前共有 ${words.length} 个单词。`, "success");
});

clearInputBtn.addEventListener("click", () => {
  wordInput.value = "";
  showInputMessage("输入框已清空。");
  wordInput.focus();
});

clearLibraryBtn.addEventListener("click", () => {
  if (words.length === 0) {
    showInputMessage("当前词库已经是空的。");
    return;
  }

  const confirmed = confirm(`确定要清空“${getCurrentLibrary().name}”里的所有单词吗？这个操作不能撤销。`);

  if (!confirmed) {
    return;
  }

  words = [];
  currentWord = null;
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

  practiceSection.hidden = false;
  setPracticeEnabled(true);
  pickNextWord();
  practiceSection.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
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
    words: []
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

function parseWords(text) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split(/\s*[-—–]\s*/);

      if (parts.length < 2) {
        return null;
      }

      const english = parts[0].trim().toLowerCase();
      const chinese = parts.slice(1).join(" - ").trim();

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

  // 用英文单词当作唯一标识，重复录入时更新中文意思。
  oldWords.forEach((item) => wordMap.set(item.english, item));
  newWords.forEach((item) => wordMap.set(item.english, item));

  return Array.from(wordMap.values()).sort((a, b) => a.english.localeCompare(b.english));
}

function renderLibraryList() {
  libraryList.innerHTML = "";

  libraries.forEach((library) => {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.className = library.id === currentLibraryId ? "library-switch active" : "library-switch";
    button.type = "button";
    button.addEventListener("click", () => switchLibrary(library.id));

    const name = document.createElement("span");
    name.textContent = library.name;

    const count = document.createElement("small");
    count.textContent = `${library.words.length} 个单词`;

    button.append(name, count);
    item.appendChild(button);
    libraryList.appendChild(item);
  });
}

function renderCurrentLibrary() {
  const currentLibrary = getCurrentLibrary();
  words = currentLibrary.words;
  activeLibraryName.textContent = currentLibrary.name;
  activeLibraryNameForInput.textContent = currentLibrary.name;
  renderWordList();
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

function editWord(oldEnglish) {
  const oldWord = words.find((word) => word.english === oldEnglish);

  if (!oldWord) {
    return;
  }

  const newEnglish = prompt("修改英文单词：", oldWord.english);

  if (newEnglish === null) {
    return;
  }

  const cleanedEnglish = newEnglish.trim().toLowerCase();

  if (!cleanedEnglish) {
    alert("英文单词不能为空。");
    return;
  }

  const newChinese = prompt("修改中文意思：", oldWord.chinese);

  if (newChinese === null) {
    return;
  }

  const cleanedChinese = newChinese.trim();

  if (!cleanedChinese) {
    alert("中文意思不能为空。");
    return;
  }

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

  saveCurrentWords(words);
  renderCurrentLibrary();
  renderLibraryList();
}

function deleteWord(english) {
  words = words.filter((word) => word.english !== english);
  saveCurrentWords(words);
  renderCurrentLibrary();
  renderLibraryList();

  if (words.length === 0) {
    hidePracticeSection();
  }

  if (currentWord && currentWord.english === english) {
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
  answerInput.value = "";
  meaningText.textContent = "请先点击开始练习";
  hintText.textContent = "_";
  feedbackText.textContent = "请输入这个单词的完整英文拼写。";
  feedbackText.className = "feedback";
}

function pickNextWord() {
  currentWord = words[Math.floor(Math.random() * words.length)];
  answerInput.value = "";
  meaningText.textContent = currentWord.chinese;
  hintText.textContent = createHint(currentWord.english);
  feedbackText.textContent = "请输入这个单词的完整英文拼写。";
  feedbackText.className = "feedback";
  answerInput.focus();
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
    renderStats();
    feedbackText.textContent = "拼写正确，进入下一题。";
    feedbackText.className = "feedback correct";

    setTimeout(() => {
      if (words.length > 0 && !practiceSection.hidden) {
        pickNextWord();
      }
    }, 650);
    return;
  }

  stats.wrong += 1;
  renderStats();
  feedbackText.textContent = `拼写错误，正确答案是：${currentWord.english}`;
  feedbackText.className = "feedback wrong";
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

function setPracticeEnabled(enabled) {
  answerInput.disabled = !enabled;
  submitBtn.disabled = !enabled;
}

function showInputMessage(text, type) {
  inputMessage.textContent = text;
  inputMessage.style.color = type === "error" ? "var(--danger)" : type === "success" ? "var(--success)" : "var(--muted)";
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
    words: legacyWords
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
    words: Array.isArray(library.words) ? library.words : []
  };
}

function createLibraryId() {
  return `library-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
