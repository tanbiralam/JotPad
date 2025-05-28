# JotPad 📝

[![npm version](https://img.shields.io/npm/v/note-app.svg)](https://www.npmjs.com/package/note-app)
[![License](https://img.shields.io/github/license/tanbiralam/JotPad)](https://github.com/tanbiralam/JotPad/blob/main/LICENSE)
[![Build Status](https://github.com/tanbiralam/JotPad/actions/workflows/build.yml/badge.svg)](https://github.com/tanbiralam/JotPad/actions/workflows/build.yml)
[![Issues](https://img.shields.io/github/issues/tanbiralam/JotPad)](https://github.com/tanbiralam/JotPad/issues)

JotPad is a lightweight, Electron-based note-taking application built with React and TypeScript. Designed as a powerful alternative to traditional notepads, it supports rich markdown editing, fast note management, and cross-platform desktop deployment. Although still under active development, JotPad aims to deliver a seamless writing experience with modern UI and efficient state management.

## ✨ Features

- **Rich Markdown Editor** powered by `@mdxeditor/editor` for intuitive formatting.
- **Atomic State Management** using `jotai` for efficient and flexible note state handling.
- **File System Integration** with `fs-extra` for saving and loading notes seamlessly.
- **Cross-Platform Desktop App** built on Electron supporting Windows, macOS, and Linux.
- **TailwindCSS Styling** with `tailwind-merge` and `@tailwindcss/typography` for consistent design.
- **Preload and Utility Toolkits** via `@electron-toolkit/preload` and `@electron-toolkit/utils` for streamlined Electron development.
- **Robust TypeScript Setup** with comprehensive type checking and linting.
- **Easy Build and Packaging** configured via `electron-builder` for platform-specific installers.

## 📋 Prerequisites

Before you begin, ensure you have met the following requirements:

1. **Node.js** (version 18 or higher recommended) and npm installed.  
2. **Git** installed to clone the repository.  
3. Familiarity with TypeScript, React, and Electron is helpful but not required.  
4. (Optional) IDE like [VSCode](https://code.visualstudio.com/) with ESLint and Prettier extensions for best development experience.  

## 🚀 Installation

1. **Clone the repository**
```bash
git clone https://github.com/tanbiralam/JotPad.git
cd JotPad
2. **Install dependencies**
```bash
npm install
3. **Set up environment variables**
```bash
cp .env.example .env
## 💻 Usage

### 1. Start development mode with hot reload:
```bash
npm run dev
This command launches the Electron app in development mode using `electron-vite`, allowing you to see live changes.

### 2. Preview the production build locally:
```bash
npm run start
Runs the production build locally for testing before packaging.

### 3. Build the application for your platform:

- **Windows:**
```bash
npm run build:win
- **macOS:**
```bash
npm run build:mac
- **Linux:**
```bash
npm run build:linux
---

### Example: Creating and Saving a Note Programmatically (TypeScript)

```typescript
import { writeFile } from 'fs-extra';
import path from 'path';

interface Note {
  id: string;
  title: string;
  content: string;
  lastModified: Date;
}

// Function to save a note to disk with error handling
async function saveNote(note: Note): Promise<void> {
  const filePath = path.join(__dirname, 'notes', `${note.id}.md`);
  try {
    await writeFile(filePath, `# ${note.title}\n\n${note.content}`, 'utf-8');
    console.log(`Note "${note.title}" saved successfully.`);
  } catch (error) {
    console.error('Failed to save note:', error);
  }
}

// Usage example
const myNote: Note = {
  id: 'note-123',
  title: 'Meeting Notes',
  content: 'Discuss project roadmap and milestones.',
  lastModified: new Date(),
};

saveNote(myNote);
---

### Example: Using Jotai to Manage Note State

```typescript
import { atom, useAtom } from 'jotai';
import React from 'react';

// Define a Jotai atom for the current note content
const noteContentAtom = atom<string>('');

// Component to edit note content
const NoteEditor: React.FC = () => {
  const [content, setContent] = useAtom(noteContentAtom);

  return (
    <textarea
      placeholder="Start typing your note..."
      value={content}
      onChange={(e) => setContent(e.target.value)}
      style={{ width: '100%', height: '300px', fontSize: '1rem' }}
    />
  );
};

export default NoteEditor;
---

### Example: Electron Preload Script for Secure IPC Communication

```typescript
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  saveNote: async (note: { id: string; content: string }) => {
    try {
      const response = await ipcRenderer.invoke('save-note', note);
      return response;
    } catch (error) {
      console.error('IPC saveNote error:', error);
      throw error;
    }
  }
});
In your renderer process, you can then call:

```typescript
window.electronAPI.saveNote({ id: 'note-1', content: 'Hello world!' })
  .then(() => console.log('Note saved'))
  .catch(console.error);
## ⚙️ Configuration

JotPad uses environment variables to manage key configurations and secrets. The `.env` file supports the following variables:

| Variable             | Description                                      | Example                              | Required |
|----------------------|------------------------------------------------|------------------------------------|----------|
| `NOTEPAD_STORAGE_DIR` | Directory path where notes are saved locally   | `/Users/username/Documents/JotPad` | Yes      |
| `APP_ENV`            | Application environment mode: `development` or `production` | `development`                      | Yes      |
| `API_KEY`            | (Optional) API key for any integrated services | `1234abcd-5678efgh`                 | No       |

You can customize the storage directory to a preferred location. Make sure the app has write permissions to the specified folder.

The `.env.example` file provides a template for these variables.

## 🤝 Contributing

Contributions are warmly welcome! To contribute:

1. Fork the repository on GitHub: [https://github.com/tanbiralam/JotPad](https://github.com/tanbiralam/JotPad)
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request describing your changes.

Please adhere to the existing code style and run lint/type checks before submitting. For major changes, open an issue first to discuss your ideas.

## 📄 License

This project is licensed under the [MIT License](https://github.com/tanbiralam/JotPad/blob/main/LICENSE).

---

# .env.example

```env
# Application environment (development or production)
APP_ENV=development

# Directory where notes will be stored
# Ensure this directory exists and is writable
NOTEPAD_STORAGE_DIR=./notes

# API Key for external services (if applicable)
# Obtain your API key from https://example-api.com/signup
API_KEY=

# SECURITY NOTES:
# - Do NOT commit your .env file or API keys to public repositories.
# - Use environment variable secrets management in production environments.
---

Thank you for exploring JotPad! We look forward to your feedback and contributions. For questions or support, please open an issue on GitHub.