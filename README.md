# BakeSmart2D

BakeSmart2D is a Phaser 3.90 and TypeScript educational bakery game. Vite produces the shared web game, and Electron packages that same production output as the Windows application.

## Development

Prerequisites:

- Node.js 22.12 or newer
- npm

Install dependencies and start the browser development server:

```powershell
npm install
npm run dev
```

Run the strict TypeScript and Vite production build:

```powershell
npm run build
```

The web production output is written to `dist/` and uses relative asset paths.

## Windows client installation

1. Double-click `BakeSmart2D Setup.exe`.
2. Complete the installation.
3. Double-click the BakeSmart2D Desktop shortcut.
4. Play.

The installer also creates a Start Menu shortcut and a normal Windows uninstall entry. The installed game includes Electron and all required web files; clients do not need Node.js, npm, VS Code, Chrome, a development server, or an internet connection for core gameplay.

The current installer is not code-signed. Windows may display a SmartScreen warning until a trusted Windows code-signing certificate is configured.

## Windows developer commands

Launch the production web build in Electron:

```powershell
npm run desktop:dev
```

Create an unpacked Windows application for QA:

```powershell
npm run desktop:dir
```

Create the client installer:

```powershell
npm run desktop:package
```

Windows outputs are written to:

```text
release/windows/
├── BakeSmart2D Setup.exe
└── win-unpacked/
    └── BakeSmart2D.exe
```

Do not manually rename packaging outputs, because generated metadata may refer to their configured names.

