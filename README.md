# JotPad 📝

[![npm version](https://img.shields.io/npm/v/note-app.svg)](https://www.npmjs.com/package/note-app)  
[![License](https://img.shields.io/github/license/tanbiralam/JotPad)](https://github.com/tanbiralam/JotPad/blob/main/LICENSE)  
[![Build Status](https://github.com/tanbiralam/JotPad/actions/workflows/build.yml/badge.svg)](https://github.com/tanbiralam/JotPad/actions/workflows/build.yml)  
[![Issues](https://img.shields.io/github/issues/tanbiralam/JotPad)](https://github.com/tanbiralam/JotPad/issues)

JotPad is a lightweight, Electron-based note-taking application built with React and TypeScript. It offers a rich markdown editing experience combined with efficient atomic state management to handle fast note creation and editing. Designed as a cross-platform desktop app, JotPad aims to be a modern, extensible alternative to traditional notepads.

## ✨ Features

- **Rich Markdown Editor** powered by [`@mdxeditor/editor`](https://www.npmjs.com/package/@mdxeditor/editor) for smooth, intuitive formatting and live preview.
- **Atomic State Management** using [`jotai`](https://jotai.org/) for scalable and efficient state handling of notes and UI.
- **File System Integration** with [`fs-extra`](https://github.com/jprichardson/node-fs-extra) for seamless note saving, loading, and management.
- **Cross-Platform Electron App** supporting Windows, macOS, and Linux with platform-specific builds.
- **TailwindCSS Styling** enhanced by `tailwind-merge` and `@tailwindcss/typography` plugins for a consistent, responsive, and elegant UI.
- **Secure IPC Communication** via Electron's preload scripts using `@electron-toolkit/preload` for safe main-renderer process messaging.
- **Robust TypeScript Setup** with strict type checking, linting, and formatting ensuring reliable code quality.
- **Comprehensive Build & Packaging** pipelines configured through `electron-builder` for easy distribution.

## 📋 Prerequisites

Before starting, ensure you have the following installed and configured:

1. **Node.js** version 18 or higher ([Download Node.js](https://nodejs.org/))  
2. **npm** package manager (comes with Node.js)  
3. **Git** for cloning the repository ([Git Downloads](https://git-scm.com/downloads))  
4. Familiarity with **TypeScript**, **React**, and **Electron** is helpful but not mandatory.  
5. (Optional) A modern IDE like [VSCode](https://code.visualstudio.com/) with ESLint and Prettier extensions for best developer experience.

## 🚀 Installation

1. **Clone the repository**  
```bash
git clone https://github.com/tanbiralam/JotPad.git
cd JotPad
```

2. **Install dependencies**  
```bash
npm install
```

3. **Set up environment variables**  
```bash
cp .env.example .env
```

## 💻 Usage

### 1. Start development mode with hot reload  
```bash
npm run dev
```
This launches JotPad in development mode with live reload via `electron-vite`. Useful for active development and debugging.

### 2. Preview production build locally  
```bash
npm run start
```
Runs the production build locally, simulating the packaged app environment before distribution.

### 3. Build the application for your platform

- **Windows:**  
```bash
npm run build:win
```

- **macOS:**  
```bash
npm run build:mac
```

- **Linux:**  
```bash
npm run build:linux
```

---

### Example 1: Creating and Saving a Note Programmatically (TypeScript)

```typescript
import { writeFile } from 'fs-extra';
import path from 'path';

interface Note {
  id: string;
  title: string;
  content: string;
  lastModified: Date;
}

/**
 * Saves a note as a markdown file to the local filesystem.
 * @param note The note object to save.
 */
async function saveNote(note: Note): Promise<void> {
  const notesDir = path.resolve(process.env.NOTEPAD_STORAGE_DIR || './notes');
  const filePath = path.join(notesDir, `${note.id}.md`);

  try {
    // Prepare markdown content
    const markdown = `# ${note.title}\n\n${note.content}\n\n*Last Modified: ${note.lastModified.toISOString()}*`;

    // Write file asynchronously
    await writeFile(filePath, markdown, 'utf-8');
    console.log(`Note "${note.title}" saved successfully at ${filePath}.`);
  } catch (error) {
    console.error('Failed to save note:', error instanceof Error ? error.message : error);
    throw error;
  }
}

// Usage
const myNote: Note = {
  id: 'note-123',
  title: 'Meeting Notes',
  content: 'Discuss project roadmap and milestones.',
  lastModified: new Date(),
};

saveNote(myNote).catch(() => {
  // Handle errors as needed
});
```

---

### Example 2: Using Jotai to Manage Note State in React

```typescript
import React from 'react';
import { atom, useAtom } from 'jotai';

// Define an atom to hold the current note content
const noteContentAtom = atom<string>('');

/**
 * NoteEditor component allows editing note content with atomic state management.
 */
const NoteEditor: React.FC = () => {
  const [content, setContent] = useAtom(noteContentAtom);

  return (
    <textarea
      placeholder="Start typing your note..."
      value={content}
      onChange={(e) => setContent(e.target.value)}
      style={{
        width: '100%',
        height: '300px',
        fontSize: '1rem',
        padding: '1rem',
        borderRadius: '8px',
        border: '1px solid #ccc',
        fontFamily: 'monospace',
      }}
      aria-label="Note content editor"
    />
  );
};

export default NoteEditor;
```

---

### Example 3: Electron Preload Script for Secure IPC Communication

```typescript
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

interface Note {
  id: string;
  content: string;
}

contextBridge.exposeInMainWorld('electronAPI', {
  /**
   * Sends a request to save a note via IPC and awaits response.
   * @param note The note object to save.
   * @returns A promise that resolves to success status.
   */
  saveNote: async (note: Note): Promise<boolean> => {
    try {
      const response = await ipcRenderer.invoke('save-note', note);
      if (typeof response === 'boolean') {
        return response;
      } else {
        throw new Error('Invalid response from save-note IPC channel');
      }
    } catch (error) {
      console.error('IPC saveNote error:', error instanceof Error ? error.message : error);
      throw error;
    }
  },

  /**
   * Listen for note update events from the main process.
   * @param callback Function to call when a note is updated.
   */
  onNoteUpdated: (callback: (noteId: string) => void) => {
    ipcRenderer.on('note-updated', (_event: IpcRendererEvent, noteId: string) => {
      callback(noteId);
    });
  },
});
```

In your renderer process, you can use the exposed API like this:

```typescript
declare global {
  interface Window {
    electronAPI: {
      saveNote: (note: { id: string; content: string }) => Promise<boolean>;
      onNoteUpdated: (callback: (noteId: string) => void) => void;
    };
  }
}

// Usage example
window.electronAPI.saveNote({ id: 'note-1', content: 'Hello world!' })
  .then(() => console.log('Note saved successfully'))
  .catch((error) => console.error('Failed to save note:', error));
```

## ⚙️ Configuration

JotPad uses environment variables to configure key application behaviors and secrets. The primary variables are:

| Variable               | Description                                           | Example                            | Required |
|------------------------|-----------------------------------------------------|----------------------------------|----------|
| `APP_ENV`              | Application environment mode (`development` or `production`) | `development`                    | Yes      |
| `NOTEPAD_STORAGE_DIR`  | Local directory path where notes are stored         | `/Users/username/Documents/JotPad/notes` | Yes      |
| `API_KEY`              | (Optional) API key for integrated external services | `1234abcd-5678efgh`               | No       |

### Notes

- Ensure the storage directory (`NOTEPAD_STORAGE_DIR`) exists and the application has write permissions.
- Keep `API_KEY` and other sensitive variables secure; do **not** commit `.env` files with secrets to public repositories.
- See `.env.example` for a template and detailed comments.

## 🤝 Contributing

Contributions to JotPad are warmly welcome! To contribute:

1. Fork the repository on GitHub: [https://github.com/tanbiralam/JotPad](https://github.com/tanbiralam/JotPad)  
2. Create your feature branch: