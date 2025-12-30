# Word Editor - React Document Editor

A Microsoft Word-like document editor built with React, TypeScript, and Syncfusion EJ2.

## Features

- **Rich Text Editing**: Bold, italic, underline, fonts, sizes, colors
- **Paragraph Formatting**: Alignment, indentation, spacing, bullets, numbering
- **Insert Objects**: Tables, images, hyperlinks, bookmarks, comments
- **Advanced Features**: Headers/footers, table of contents, track changes, spell check
- **File Operations**: Save/Open SFDT format, Export to DOCX

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Get Syncfusion License

1. Visit [Syncfusion](https://www.syncfusion.com/account/manage-trials/start-trials)
2. Create a free account and get a trial/community license
3. Open `src/main.tsx`
4. Replace `'YOUR_SYNCFUSION_LICENSE_KEY'` with your actual key

### 3. Run Development Server

```bash
npm start
```

The app will open at `http://localhost:5173`

## File Formats

### SFDT (Native Format)
- Full fidelity save/open
- No backend required
- Use "Save" and "Open" buttons

### DOCX Export
- Click "Export DOCX" to download
- No backend required for export

### DOCX Import (Requires Backend)
To import DOCX files, you need a backend service:

1. Create a Node.js server with Syncfusion's document processing SDK
2. Set the `serviceUrl` prop in `DocumentEditor.tsx`
3. The backend converts DOCX to SFDT format

Sample backend code is provided in `server/` directory.

## Keyboard Shortcuts

- **Ctrl+B**: Bold
- **Ctrl+I**: Italic
- **Ctrl+U**: Underline
- **Ctrl+S**: Save (handled by browser)
- **Ctrl+Z**: Undo
- **Ctrl+Y**: Redo
- **Ctrl+F**: Find

## Production Build

```bash
npm run build
```

Output will be in the `dist/` directory.

## Troubleshooting

### License Warning
If you see a license warning, ensure you've registered your Syncfusion license key in `src/main.tsx`.

### CORS Issues
If using a backend service, ensure CORS is properly configured on your server.

### Large Files
Files over 10MB may cause performance issues. Consider optimizing images before insertion.

## Tech Stack

- React 18+ with TypeScript
- Syncfusion EJ2 Document Editor
- Tailwind CSS
- Vite
