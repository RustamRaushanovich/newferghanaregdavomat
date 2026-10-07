const { app, BrowserWindow, ipcMain, shell, session } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    // Configure session to persist cookies, localStorage, session for Telegram & Davomat
    const customSession = session.fromPartition('persist:davomat_session');

    // Enable custom user agent to ensure Telegram Web loads flawlessly
    customSession.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');

    mainWindow = new BrowserWindow({
        width: 1440,
        height: 900,
        minWidth: 1024,
        minHeight: 700,
        title: "Ferghana Davomat & Telegram Desktop",
        frame: false, // Custom sleek glassmorphic titlebar
        backgroundColor: '#0f172a',
        icon: path.join(__dirname, 'app_icon.png'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            webviewTag: true, // Allows webviews for 75% Davomat + 25% Telegram Web
            preload: path.join(__dirname, 'preload.js'),
            session: customSession
        }
    });

    mainWindow.loadFile(path.join(__dirname, 'index.html'));

    // Handle external links opening in default browser
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('http://') || url.startsWith('https://')) {
            shell.openExternal(url);
            return { action: 'deny' };
        }
        return { action: 'allow' };
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// Window control IPC handlers
ipcMain.on('window-minimize', () => {
    if (mainWindow) mainWindow.minimize();
});

ipcMain.on('window-maximize', () => {
    if (mainWindow) {
        if (mainWindow.isMaximized()) {
            mainWindow.unmaximize();
        } else {
            mainWindow.maximize();
        }
    }
});

ipcMain.on('window-close', () => {
    if (mainWindow) mainWindow.close();
});

app.whenReady().then(() => {
    // Configure Windows Autostart on startup
    try {
        app.setLoginItemSettings({
            openAtLogin: true,
            path: app.getPath('exe')
        });
    } catch (e) { }

    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
