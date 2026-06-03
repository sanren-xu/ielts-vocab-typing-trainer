(function () {
  const LIBRARIES_STORAGE_KEY = "ieltsTypingLearnerLibraries";
  const DATA_VERSION_STORAGE_KEY = "ieltsTypingLearnerDataVersion";
  const DATA_VERSION = "2";
  const DEFAULT_LIBRARY_NAME = "\u672a\u547d\u540d\u8bcd\u5e93";

  function toText(value) {
    return typeof value === "string" ? value : "";
  }

  function toDateValue(value, fallback) {
    return typeof value === "string" && value.trim() ? value : fallback;
  }

  function toNullableDateValue(value) {
    return typeof value === "string" && value.trim() ? value : null;
  }

  function toCount(value, fallback = 0) {
    const count = Number(value);
    return Number.isFinite(count) && count >= 0 ? count : fallback;
  }

  function createId(prefix = "id", usedIds = new Set()) {
    let id = "";

    do {
      id = `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    } while (usedIds.has(id));

    usedIds.add(id);
    return id;
  }

  function takeId(value, prefix, usedIds, createCustomId) {
    const existingId = toText(value).trim();

    if (existingId && !usedIds.has(existingId)) {
      usedIds.add(existingId);
      return existingId;
    }

    if (typeof createCustomId === "function") {
      const customId = toText(createCustomId()).trim();

      if (customId && !usedIds.has(customId)) {
        usedIds.add(customId);
        return customId;
      }
    }

    return createId(prefix, usedIds);
  }

  function normalizeWrongWord(word = {}) {
    const wrongCount = toCount(word.wrongCount, 1);

    return {
      ...word,
      english: toText(word.english),
      chinese: toText(word.chinese),
      example: toText(word.example),
      wrongCount: wrongCount > 0 ? wrongCount : 1,
      correctStreak: toCount(word.correctStreak, 0)
    };
  }

  function normalizeWord(word = {}, context = {}) {
    const now = context.now || new Date().toISOString();
    const usedWordIds = context.usedWordIds || new Set();
    const library = context.library || {};

    return {
      ...word,
      id: takeId(word.id, "word", usedWordIds, context.createWordId),
      english: toText(word.english),
      chinese: toText(word.chinese),
      example: toText(word.example),
      source: toText(word.source) || toText(library.source),
      createdAt: toDateValue(word.createdAt, now),
      updatedAt: toDateValue(word.updatedAt, now),
      practiceCount: toCount(word.practiceCount, 0),
      correctCount: toCount(word.correctCount, 0),
      wrongRoundCount: toCount(word.wrongRoundCount, 0),
      correctStreak: toCount(word.correctStreak, 0),
      lastPracticedAt: toNullableDateValue(word.lastPracticedAt),
      mastered: typeof word.mastered === "boolean" ? word.mastered : false,
      masteredAt: toNullableDateValue(word.masteredAt),
      inWrongBook: typeof word.inWrongBook === "boolean" ? word.inWrongBook : false
    };
  }

  function createWordFromWrongWord(wrongWord, context) {
    return normalizeWord({
      english: wrongWord.english,
      chinese: wrongWord.chinese,
      example: wrongWord.example,
      wrongRoundCount: wrongWord.wrongCount,
      correctStreak: wrongWord.correctStreak,
      inWrongBook: true
    }, context);
  }

  function mergeWrongWordsIntoWords(words, wrongWords, context) {
    const wordByEnglish = new Map();

    words.forEach((word) => {
      const key = word.english.trim().toLowerCase();
      if (key && !wordByEnglish.has(key)) {
        wordByEnglish.set(key, word);
      }
    });

    wrongWords.forEach((wrongWord) => {
      const key = wrongWord.english.trim().toLowerCase();

      if (!key) {
        return;
      }

      const matchedWord = wordByEnglish.get(key);

      if (matchedWord) {
        matchedWord.inWrongBook = true;
        matchedWord.wrongRoundCount = Math.max(matchedWord.wrongRoundCount, wrongWord.wrongCount);
        matchedWord.correctStreak = toCount(wrongWord.correctStreak, matchedWord.correctStreak);

        if (!matchedWord.chinese && wrongWord.chinese) {
          matchedWord.chinese = wrongWord.chinese;
        }

        if (!matchedWord.example && wrongWord.example) {
          matchedWord.example = wrongWord.example;
        }

        return;
      }

      const newWord = createWordFromWrongWord(wrongWord, context);
      words.push(newWord);
      wordByEnglish.set(key, newWord);
    });

    return words;
  }

  function normalizeLibrary(library = {}, options = {}) {
    const now = options.now || new Date().toISOString();
    const usedLibraryIds = options.usedLibraryIds || new Set();
    const usedWordIds = options.usedWordIds || new Set();
    const normalizedLibrary = {
      ...library,
      id: takeId(library.id, "library", usedLibraryIds, options.createLibraryId || options.createId),
      name: toText(library.name) || options.fallbackLibraryName || DEFAULT_LIBRARY_NAME,
      source: toText(library.source),
      createdAt: toDateValue(library.createdAt, now),
      updatedAt: toDateValue(library.updatedAt, now),
      lastPracticedAt: toNullableDateValue(library.lastPracticedAt),
      totalPracticeRounds: toCount(library.totalPracticeRounds, 0),
      words: [],
      wrongWords: []
    };
    const wordContext = {
      now,
      usedWordIds,
      library: normalizedLibrary,
      createWordId: options.createWordId
    };

    normalizedLibrary.wrongWords = Array.isArray(library.wrongWords)
      ? library.wrongWords.map(normalizeWrongWord)
      : [];
    const wrongWordKeys = new Set(normalizedLibrary.wrongWords
      .map((word) => word.english.trim().toLowerCase())
      .filter(Boolean));

    normalizedLibrary.words = Array.isArray(library.words)
      ? library.words.map((word) => {
        const normalizedWord = normalizeWord(word, wordContext);
        normalizedWord.inWrongBook = wrongWordKeys.has(normalizedWord.english.trim().toLowerCase());
        return normalizedWord;
      })
      : [];
    normalizedLibrary.words = mergeWrongWordsIntoWords(normalizedLibrary.words, normalizedLibrary.wrongWords, wordContext);

    return normalizedLibrary;
  }

  function normalizeLibraries(libraries, options = {}) {
    if (!Array.isArray(libraries)) {
      return [];
    }

    const now = new Date().toISOString();
    const usedLibraryIds = new Set();
    const usedWordIds = new Set();

    return libraries.map((library) => normalizeLibrary(library, {
      ...options,
      now,
      usedLibraryIds,
      usedWordIds
    }));
  }

  function saveLibraries(libraries, options = {}) {
    const normalizedLibraries = normalizeLibraries(libraries, options);
    localStorage.setItem(LIBRARIES_STORAGE_KEY, JSON.stringify(normalizedLibraries));
    localStorage.setItem(DATA_VERSION_STORAGE_KEY, DATA_VERSION);
    return normalizedLibraries;
  }

  function migrateStoredData(options = {}) {
    const savedLibraries = localStorage.getItem(LIBRARIES_STORAGE_KEY);

    if (!savedLibraries) {
      localStorage.setItem(DATA_VERSION_STORAGE_KEY, DATA_VERSION);
      return null;
    }

    try {
      const parsedLibraries = JSON.parse(savedLibraries);

      if (!Array.isArray(parsedLibraries)) {
        localStorage.setItem(DATA_VERSION_STORAGE_KEY, DATA_VERSION);
        return null;
      }

      return saveLibraries(parsedLibraries, options);
    } catch {
      localStorage.setItem(DATA_VERSION_STORAGE_KEY, DATA_VERSION);
      return null;
    }
  }

  window.IELTSDataModel = {
    DATA_VERSION,
    DATA_VERSION_STORAGE_KEY,
    LIBRARIES_STORAGE_KEY,
    createId,
    normalizeLibrary,
    normalizeLibraries,
    normalizeWord,
    normalizeWrongWord,
    saveLibraries,
    migrateStoredData
  };
})();
