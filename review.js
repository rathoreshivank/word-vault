// State: all saved words, and the one currently on screen
let words = [];
let currentWord = null;

// Grab the page elements once, by their ids in review.html
const emptyEl = document.getElementById("empty");
const cardEl = document.getElementById("card");
const wordEl = document.getElementById("word");
const posEl = document.getElementById("pos");
const definitionEl = document.getElementById("definition");
const showBtn = document.getElementById("show-btn");
const answerBtns = document.getElementById("answer-btns");
const wrongBtn = document.getElementById("wrong-btn");
const rightBtn = document.getElementById("right-btn");

// Pick a random word (never the same one twice in a row, unless there's only one)
function pickWord() {
  if (words.length === 1) return words[0];

  let next;
  do {
    next = words[Math.floor(Math.random() * words.length)];
  } while (next === currentWord);

  return next;
}

// Question screen: definition visible, word hidden
function showQuestion() {
  currentWord = pickWord();

  wordEl.textContent = currentWord.word;
  posEl.textContent = currentWord.partOfSpeech;
  definitionEl.textContent = currentWord.definition;

  wordEl.hidden = false;
  definitionEl.hidden = true;
  answerBtns.hidden = true;
  showBtn.hidden = false;
}

// Answer screen: reveal the word, swap the buttons
function showAnswer() {
  definitionEl.hidden = false;
  showBtn.hidden = true;
  answerBtns.hidden = false;
}

// Record the answer, save it, then show the next word
function recordAnswer(knewIt) {
  if (knewIt) {
    currentWord.correct = (currentWord.correct || 0) + 1;
  } else {
    currentWord.wrong = (currentWord.wrong || 0) + 1;
  }

  chrome.storage.local.set({ words }, showQuestion);
}

showBtn.addEventListener("click", showAnswer);
rightBtn.addEventListener("click", () => recordAnswer(true));
wrongBtn.addEventListener("click", () => recordAnswer(false));

// Start: load saved words, then show the first question (or the empty state)
chrome.storage.local.get({ words: [] }, (result) => {
  words = result.words;

  if (words.length === 0) {
    cardEl.hidden = true;
    emptyEl.hidden = false;
    return;
  }

  showQuestion();
});