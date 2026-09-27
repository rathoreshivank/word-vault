# 📖 Word Vault

A Chrome extension that automatically saves word definitions from your Google searches.

## How it works

Search something like `meaning of ephemeral` or `define resilience` on Google as you normally would. Word Vault detects it in the background, fetches the definition, and saves it — no manual steps needed.

## Installation

1. Clone this repository
2. Go to `chrome://extensions` in Chrome
3. Enable **Developer mode**
4. Click **Load unpacked** and select the project folder

## Tech stack

- Chrome Extension Manifest V3
- Vanilla JavaScript
- Wiktionary API + dictionaryapi.dev (fallback)
- `chrome.storage.local` for storage

## Status

🚧 Work in progress — v1 core features working, more coming.

## License

MIT — see [LICENSE](LICENSE)