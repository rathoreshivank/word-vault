chrome.storage.local.get({ words: [] }, (result) => {
  const list = document.getElementById("list");
  const words = result.words;

  if (words.length === 0) {
    list.innerHTML = "<li>No words saved yet. Search something on Google.</li>";
    return;
  }

  words.forEach(w => {
    const li = document.createElement("li");
    li.innerHTML = `<div class="word">${w.word}</div>
                     <div class="pos">${w.partOfSpeech}</div>
                     <div class="def">${w.definition}</div>`;
    list.appendChild(li);
  });
});