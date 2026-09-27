function render() {
  chrome.storage.local.get({ words: [] }, (result) => {
    const list = document.getElementById("list");
    const words = result.words;

    list.innerHTML = "";

    if (words.length === 0) {
      list.innerHTML = '<li class="empty">No words saved yet. Search something on Google.</li>';
      return;
    }

    words.forEach((w, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <div class="word-row">
          <div>
            <div class="word">${w.word}</div>
            <div class="pos">${w.partOfSpeech}</div>
            <div class="def">${w.definition}</div>
          </div>
          <button class="delete-btn" data-index="${index}">&times;</button>
        </div>
      `;
      list.appendChild(li);
    });

    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const indexToDelete = parseInt(e.target.getAttribute("data-index"));
        deleteWord(indexToDelete);
      });
    });
  });
}

function deleteWord(index) {
  chrome.storage.local.get({ words: [] }, (result) => {
    const words = result.words;
    words.splice(index, 1);
    chrome.storage.local.set({ words }, () => {
      render();
    });
  });
}

render();