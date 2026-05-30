const STORAGE_KEY = "ieltsTypingLearnerWords";

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

let words = loadWords();
let currentWord = null;
let stats = {
  correct: 0,
  wrong: 0,
  done: 0
};

renderWordList();
renderStats();
setPracticeEnabled(false);

generateBtn.addEventListener("click", () => {
  const parsedWords = parseWords(wordInput.value);

  if (parsedWords.length === 0) {
    showInputMessage("没有识别到有效单词，请使用“英文 - 中文意思”的格式。", "error");
    return;
  }

  words = mergeWords(words, parsedWords);
  saveWords();
  renderWordList();
  showInputMessage(`已生成词库，共 ${words.length} 个单词。`, "success");
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

  const confirmed = confirm("确定要清空整个词库吗？这个操作不能撤销。");

  if (!confirmed) {
    return;
  }

  words = [];
  currentWord = null;
  saveWords();
  renderWordList();
  hidePracticeSection();
  showInputMessage("词库已清空。");
});

startBtn.addEventListener("click", () => {
  if (words.length === 0) {
    showInputMessage("请先生成词库，再开始练习。", "error");
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
  stats = {
    correct: 0,
    wrong: 0,
    done: 0
  };
  renderStats();
  feedbackText.textContent = "统计已重置，可以继续练习。";
  feedbackText.className = "feedback";
});

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

  // 编辑时也保持英文单词不重复。
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

  saveWords();
  renderWordList();
}

function deleteWord(english) {
  words = words.filter((word) => word.english !== english);
  saveWords();
  renderWordList();

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

function saveWords() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
}

function loadWords() {
  const savedWords = localStorage.getItem(STORAGE_KEY);

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
