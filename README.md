<div align="center">

<br/>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%236366f1'/%3E%3Cstop offset='100%25' stop-color='%2322d3ee'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect x='4' y='4' width='16' height='18' rx='2' stroke='url(%23g)' stroke-width='1.8' fill='none'/%3E%3Cpath d='M9 2h6a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z' stroke='url(%23g)' stroke-width='1.8' fill='none'/%3E%3Cpath d='M12 8l1 3 3 1-3 1-1 3-1-3-3-1 3-1z' fill='url(%23g)'/%3E%3C/svg%3E">
  <img width="80" alt="ClearPaste Logo" src="data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%236366f1'/%3E%3Cstop offset='100%25' stop-color='%2322d3ee'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect x='4' y='4' width='16' height='18' rx='2' stroke='url(%23g)' stroke-width='1.8' fill='none'/%3E%3Cpath d='M9 2h6a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z' stroke='url(%23g)' stroke-width='1.8' fill='none'/%3E%3Cpath d='M12 8l1 3 3 1-3 1-1 3-1-3-3-1 3-1z' fill='url(%23g)'/%3E%3C/svg%3E">
</picture>

# ClearPaste

**Your clipboard, purified.**

A lightweight macOS clipboard manager with Automatic cleaning.
Automatically removes invisible Unicode characters that Automatictools secretly insert in your copied text.

[![macOS](https://img.shields.io/badge/macOS-12%2B-000000?style=flat-square&logo=apple&logoColor=white)](https://github.com/clearpaste)
[![License: MIT](https://img.shields.io/badge/License-MIT-6366f1?style=flat-square)](LICENSE)
[![Electron](https://img.shields.io/badge/Electron-30-47848F?style=flat-square&logo=electron&logoColor=white)](https://www.electronjs.org/)
[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-☕-FFDD00?style=flat-square)](https://buymeacoffee.com/lorenzo040)

<br/>

</div>

---

## The Problem

Every time you copy text from **ChatGPT**, **Claude**, **Copilot**, or any Automatictool, you're unknowingly copying dozens of **invisible Unicode characters** — zero-width joiners, soft hyphens, directional marks, and more.

These hidden characters:

- 🐛 **Break code** — Cause mysterious syntax errors and failing tests
- 🔍 **Corrupt searches** — Ctrl+F can't find text that "looks" identical
- 📋 **Poison data** — Contaminate databases, configs, and documents
- 🕵️ **Track you** — Some are used as invisible watermarks

**ClearPaste fixes this.** It intercepts every copy and silently removes these characters before they cause problems.

## Features

<table>
<tr>
<td width="50%">

### ✨ Automatic Clean
Automatically strips invisible characters from every text you copy. Zero-width joiners, soft hyphens, directional marks, invisible math operators — all removed instantly.

</td>
<td width="50%">

### ⌨️ Keyboard-First
Navigate with arrow keys, paste with `⌘1`–`⌘9`, pin with `⌥P`, delete with `⌥⌫`. Designed for developers who never leave the keyboard.

</td>
</tr>
<tr>
<td width="50%">

### 🛡️ 100% Private
Everything stays on your Mac. No cloud sync, no analytics, no tracking, no accounts. Your clipboard history never leaves your machine.

</td>
<td width="50%">

### ⚡ Instant Access
Open your full clipboard history in under 50ms with `⇧⌘V`. Search through everything, pin important items, and paste in a flash.

</td>
</tr>
</table>

## How It Works

```
┌─────────┐     ┌──────────────┐     ┌─────────────┐
│  Copy   │────▶│  AutomaticClean    │────▶│ Clean text   │
│  text   │     │  auto-strips │     │ in clipboard │
└─────────┘     │  invisible   │     └─────────────┘
                │  characters  │
                └──────────────┘
```

**1.** Copy anything from any app — ClearPaste captures it automatically
**2.** Invisible characters are detected and removed in real-time
**3.** Press `⇧⌘V` → select → paste perfectly clean text

## Characters Detected & Removed

| Character | Unicode | Description |
|-----------|---------|-------------|
| Zero-Width Space | `U+200B` | Invisible space with no width |
| Zero-Width Non-Joiner | `U+200C` | Prevents ligature formation |
| Zero-Width Joiner | `U+200D` | Joins characters (preserved in emoji) |
| Word Joiner | `U+2060` | Invisible word joining |
| BOM / ZWNBSP | `U+FEFF` | Byte order mark, often leftover |
| Combining Grapheme Joiner | `U+034F` | Invisible combining character |
| Soft Hyphen | `U+00AD` | Invisible hyphenation hint |
| LTR / RTL Marks | `U+200E` `U+200F` | Directional text marks |
| Invisible Math Operators | `U+2061`–`U+2064` | Invisible function/times/separator |
| Non-Breaking Space | `U+00A0` | Normalized to regular space |

> **Smart emoji handling**: ClearPaste preserves Zero-Width Joiners used inside compound emoji sequences (👨‍👩‍👧‍👦) while removing standalone ones.

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Open ClearPaste | `⇧⌘V` |
| Navigate items | `↑` `↓` |
| Copy selected item | `↩` |
| Paste selected item | `⌥↩` |
| Quick paste | `⌘1` – `⌘9` |
| Pin / Unpin | `⌥P` |
| Delete item | `⌥⌫` |
| Clear history | `⌥⌘⌫` |
| Open preferences | `⌘,` |
| Close popup | `Esc` |

## Installation

### Download

Download the latest release from the [Releases](https://github.com/clearpaste/clearpaste/releases) page.

> Supports **macOS 12+** on both Apple Silicon and Intel Macs.

### Build from Source

```bash
# Clone the repository
git clone https://github.com/clearpaste/clearpaste.git
cd clearpaste

# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build
npm run dist
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Electron](https://www.electronjs.org/) 30 |
| Frontend | [React](https://react.dev/) 18 + TypeScript |
| Build | [electron-vite](https://electron-vite.org/) + Vite 5 |
| Storage | [electron-store](https://github.com/sindresorhus/electron-store) |
| Design | Custom CSS with glassmorphism + gradient design system |

## Project Structure

```
clearpaste/
├── src/
│   ├── main/               # Electron main process
│   │   ├── index.ts         # App lifecycle, windows, IPC
│   │   ├── clipboard-monitor.ts  # Clipboard polling
│   │   ├── text-cleaner.ts  # Unicode cleaning engine
│   │   ├── store.ts         # Persistent storage
│   │   └── tray.ts          # Menu bar tray icon
│   ├── preload/             # Context bridge
│   ├── renderer/
│   │   ├── popup/           # Clipboard popup window
│   │   │   ├── App.tsx
│   │   │   ├── components/  # SearchBar, ClipboardList, etc.
│   │   │   └── styles/
│   │   ├── settings/        # Preferences window
│   │   │   ├── App.tsx
│   │   │   ├── tabs/        # General, Appearance, AutomaticClean, Ignore
│   │   │   └── styles/
│   │   └── shared/          # Shared icons & components
│   └── shared/
│       └── types.ts         # Shared TypeScript types
├── resources/               # App icons
├── website/                 # Marketing landing page
└── electron.vite.config.ts
```

## Settings

ClearPaste is highly configurable through the Preferences window (`⌘,`):

- **General** — Launch at login, clipboard check interval, history size, paste behavior, global hotkey
- **Appearance** — Popup position (tray / center / cursor), footer visibility, theme (system / dark / light)
- **AutomaticClean** — Toggle individual character types, auto-clean on copy, cleaning badge visibility, emoji preservation
- **Ignore** — Exclude specific apps and pasteboard types (1Password, etc.)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support the Project

If ClearPaste saves you from invisible character headaches, consider supporting development:

<a href="https://buymeacoffee.com/lorenzo040" target="_blank">
  <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" height="48">
</a>

## License

Distributed under the **MIT License**. See [LICENSE](LICENSE) for more information.

---

<div align="center">
  <sub>Built with ❤️ for developers who care about clean text.</sub>
  <br/>
  <sub>ClearPaste — your clipboard, purified.</sub>
</div>
