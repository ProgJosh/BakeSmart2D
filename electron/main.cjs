const { app, BrowserWindow, session } = require('electron');
const { writeFile, mkdir } = require('node:fs/promises');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const APP_TITLE = 'BakeSmart2D';
const smokeOutputArg = process.argv.find((argument) => argument.startsWith('--bakesmart-smoke-output='));
const smokeOutputDirectory = smokeOutputArg?.slice('--bakesmart-smoke-output='.length);
const smokeTest = process.argv.includes('--bakesmart-smoke-test') && Boolean(smokeOutputDirectory);

app.enableSandbox();

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.whenReady().then(() => {
    session.defaultSession.setPermissionRequestHandler((_webContents, _permission, callback) => callback(false));
    createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });
}

function createWindow() {
  const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
  const allowedUrl = pathToFileURL(indexPath).toString();
  const mainWindow = new BrowserWindow({
    title: APP_TITLE,
    width: 1280,
    height: 760,
    minWidth: 960,
    minHeight: 600,
    center: true,
    show: false,
    backgroundColor: '#2b1a0d',
    autoHideMenuBar: true,
    resizable: true,
    minimizable: true,
    maximizable: true,
    fullscreenable: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      devTools: !app.isPackaged,
      spellcheck: false
    }
  });

  mainWindow.removeMenu();
  mainWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
    if (navigationUrl !== allowedUrl && !navigationUrl.startsWith(`${allowedUrl}#`)) event.preventDefault();
  });
  mainWindow.once('ready-to-show', () => mainWindow.show());

  if (smokeTest) installSmokeCapture(mainWindow);

  mainWindow.loadFile(indexPath).catch((error) => {
    console.error(`Unable to load BakeSmart2D production files: ${error.message}`);
    app.exit(1);
  });
}

function installSmokeCapture(mainWindow) {
  mainWindow.webContents.once('did-finish-load', () => {
    setTimeout(async () => {
      try {
        const renderer = await mainWindow.webContents.executeJavaScript(`({
          title: document.title,
          canvasCount: document.querySelectorAll('canvas').length,
          canvasWidth: document.querySelector('canvas')?.width ?? 0,
          canvasHeight: document.querySelector('canvas')?.height ?? 0,
          orientationOverlayHidden: document.querySelector('#orientation-lock')?.hidden ?? false
        })`, true);
        const image = await mainWindow.capturePage();
        await mkdir(smokeOutputDirectory, { recursive: true });
        await writeFile(path.join(smokeOutputDirectory, 'main-menu.png'), image.toPNG());
        await writeFile(
          path.join(smokeOutputDirectory, 'smoke-result.json'),
          JSON.stringify(
            {
              passed: renderer.title === APP_TITLE && renderer.canvasCount === 1,
              packaged: app.isPackaged,
              url: mainWindow.webContents.getURL(),
              renderer
            },
            null,
            2
          )
        );
        app.exit(renderer.title === APP_TITLE && renderer.canvasCount === 1 ? 0 : 1);
      } catch (error) {
        await mkdir(smokeOutputDirectory, { recursive: true });
        await writeFile(path.join(smokeOutputDirectory, 'smoke-result.json'), JSON.stringify({ passed: false, error: error.message }, null, 2));
        app.exit(1);
      }
    }, 1800);
  });
}

app.on('window-all-closed', () => app.quit());

