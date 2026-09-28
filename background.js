const PATTERNS = [
  /meaning of ([a-zA-Z\s]+?)(?:\s+in|\?|$)/i,
  /define ([a-zA-Z\s]+?)(?:\s+in|\?|$)/i,
  /what does ([a-zA-Z\s]+?) mean/i,
  /([a-zA-Z\s]+?) meaning/i,
  /([a-zA-Z\s]+?) synonym/i
];

// Fetch definition — tries Wiktionary first, falls back to dictionaryapi.dev
async function getDefinition(word) {
  try {
    const res = await fetch(`https://en.wiktionary.org/api/rest_v1/page/definition/${word}`);
    if (res.ok) {
      const data = await res.json();
      const entry = data.en?.[0];
      if (entry) {
        const rawDef = entry.definitions?.[0]?.definition || "";
        const cleanDef = rawDef.replace(/<[^>]+>/g, "");
        if (cleanDef) {
          return { definition: cleanDef, partOfSpeech: entry.partOfSpeech || "" };
        }
      }
    }
  } catch (e) {
    console.log("Wiktionary failed:", e.message);
  }

  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    if (res.ok) {
      const data = await res.json();
      const meaning = data[0]?.meanings?.[0];
      const def = meaning?.definitions?.[0]?.definition || "";
      if (def) {
        return { definition: def, partOfSpeech: meaning?.partOfSpeech || "" };
      }
    }
  } catch (e) {
    console.log("Dictionary API failed too:", e.message);
  }

  return null;
}

chrome.history.onVisited.addListener(async (historyItem) => {
  const url = historyItem.url;
  if (!url || !url.includes("google.com/search")) return;

  let query;
  try {
    query = new URL(url).searchParams.get("q");
  } catch (e) {
    return;
  }
  if (!query) return;

  // Matching against regex list
  let word = null;
  for (const pattern of PATTERNS) {
    const match = query.match(pattern);
    if (match) {
      word = match[1].toLowerCase().trim();
      break;
    }
  }
  if (!word) return;

  // Fetch definition (Wiktionary first, dictionaryapi.dev as backup)
  const result = await getDefinition(word);
  if (!result) return;
  const { definition, partOfSpeech } = result;

  // Save to storage, dedupe by word
  chrome.storage.local.get({ words: [] }, (result) => {
    const words = result.words;
    if (words.some(w => w.word === word)) return;

    words.unshift({
      word,
      partOfSpeech,
      definition,
      timestamp: Date.now(),
      correct: 0,
      wrong: 0
    });

    chrome.storage.local.set({ words });
  });
});