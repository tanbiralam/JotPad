# JotPad 📝

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://github.com/tanbiralam/JotPad/actions/workflows/build.yml/badge.svg)](https://github.com/tanbiralam/JotPad/actions/workflows/build.yml)  
[![Issues](https://img.shields.io/github/issues/tanbiralam/JotPad)](https://github.com/tanbiralam/JotPad/issues)

JotPad is a modern, lightweight, and extensible note-taking desktop application built with **Electron**, **React**, and **TypeScript**. Designed for speed and developer experience, it features a rich MDX (Markdown) editor, atomic state management, and seamless offline-first local file system storage.

---

## ✨ Key Features

- **Rich Markdown Editing**: Powered by [`@mdxeditor/editor`](https://mdxeditor.dev/), offering a live-preview, block-based WYSIWYG experience for Markdown while fully preserving standard formatting.
- **Offline First & Secure Storage**: Notes are persisted directly to your local file system as `.md` and `.txt` files through highly secure Inter-Process Communication (IPC). No cloud dependency.
- **Lightning-Fast Atomic State**: State management is handled by [`jotai`](https://jotai.org/) allowing isolated re-renders, instant auto-saving, and high UI performance.
- **Beautiful UI**: Polished, cross-platform interface styled via **Tailwind CSS**.
- **Powerful Search and Management**: Real-time instantaneous filtering, note pinning, and soft-delete features (Trash panel).
- **Cross-Platform**: Packaged for Windows, macOS, and Linux using `electron-builder`.

## 📸 Screenshots

### 1. Main Editor

![JotPad Main Editor - Rich Markdown Editing](./images/jotpad-main-editor.png)

_Distraction-free markdown editor with live preview, block-based editing, and beautiful typography._

### 2. Notes Sidebar & Management

![JotPad Home](./images/jotpad-splash-screen.png)

_Fast note navigation, real-time search, pinning, and soft-delete trash system._

---

> All screenshots taken on Windows 11. The app maintains a consistent, native look across **Windows**, **macOS**, and **Linux**.

## 🏗️ Technical Architecture

This application is built using the robust [`electron-vite`](https://electron-vite.org/) tooling.

1. **Main Process (`src/main`)**:
   - Handles the heavy lifting and OS integrations.
   - Manages file system operations (`fs-extra`) to read, write, and safely delete notes directly to the user's hard drive.
2. **Preload Script (`src/preload`)**:
   - Secures the application via Electron's `contextBridge`.
   - Exposes a fully typed `window.context` API (e.g., `getNotes`, `readNote`, `writeNote`, `deleteNote`) enabling the frontend to securely interact with the Main process without exposing Node.js directly.
3. **Renderer Process (`src/renderer`)**:
   - **React 18** frontend integrated with **Vite** for incredibly fast Hot Module Replacement (HMR).
   - **Jotai Atoms**: Notes, themes, and application state are broken down into atoms. Specialized logic is used to aggressively cache note content, updating the UI smoothly while asynchronous file-writes happen in the background.

### 📁 Project Structure

```text
JotPad/
├── build/                 # OS-specific application icons (macOS, Windows, Linux)
├── resources/             # Assets consumed directly by the Main process
├── src/
│   ├── main/              # Electron main process (Node.js backend, File System ops)
│   ├── preload/           # Secure IPC bridge (Exposes APIs to the Renderer)
│   ├── renderer/          # React frontend (UI, Hooks, Store, Editor)
│   │   ├── src/assets/    # Global CSS and images
│   │   ├── src/components/# UI Components (MDEditor, Sidebar, Modals, Buttons)
│   │   ├── src/hooks/     # Custom React hooks (useMD, useNotesList, etc.)
│   │   └── src/store/     # Jotai atomic state declarations
│   └── shared/            # Shared TypeScript types & constants across processes
└── electron.vite.config.ts# Electron build configurations
```

---

## 🚀 Getting Started

### Prerequisites

To build and run the application locally, you will need:

- **Node.js** v18+ ([Download Node.js](https://nodejs.org/))
- **Git**

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/tanbiralam/JotPad.git
   cd JotPad
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

### Development

To start the application in development mode with live reloading (HMR) for both the renderer and main processes:

```bash
npm run dev
```

### Packaging & Distribution

To build and package the application into a standalone executable for your operating system:

**For Windows:**

```bash
npm run build:win
```

**For macOS:**

```bash
npm run build:mac
```

**For Linux (AppImage, deb, snap):**

```bash
npm run build:linux
```

The resulting executables will be generated inside the `dist/` directory.

---

## 🛠️ Modifying the Application

- **Changing the App Logo**: Replacing the app logo requires updating three different assets:
  1. `src/renderer/src/assets/icon.png` (Used inside the UI, like your splash screen)
  2. `resources/icon.png` (Used for the active application window created by the Main process)
  3. `build/icon.*` (Used by `electron-builder` to generate the `.exe` / `.app` desktop shortcuts). You will need an `.ico` for Windows and an `.icns` for Mac.

---

## 🤝 Contributing

We welcome contributions! To contribute:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See [`LICENSE`](./LICENSE) for more information.

---

Made with ❤️ by [Tanbir Alam](https://github.com/tanbiralam).
