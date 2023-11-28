// Module to control the application lifecycle and the native browser window.
const { app, BrowserWindow, shell } = require("electron");
const path = require("path");
const url = require("url");
const { autoUpdater } = require("electron-updater");
const process = require("process");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let deeplinkURL;

// TODO: remove once the repository is public
process.env["GH_TOKEN"] =
  "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";

// Assure single instance
if (!app.requestSingleInstanceLock()) {
  app.quit();
  return;
}

// Check for app updates, download and notify UI if update is available to be installed.
try {
  autoUpdater.checkForUpdatesAndNotify();
} catch (e) {
  console.log(e);
}

/**
 * Send event to UI when app update is ready to be installed.
 *
 * If the update installation won't be triggered by the user,
 * it will be applied the next time the app starts.
 */
app.on("update-downloaded", releaseName => {
  console.log(`Umami update ${releaseName} downloaded and ready to be installed`, url);
  mainWindow.webContents.send("app-update-downloaded");
});

// Enable experimental to activate Web USB support
app.commandLine.appendSwitch("enable-experimental-web-platform-features", true);

// Create the native browser window.
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 1024,
    minWidth: 1200,
    minHeight: 900,
    backgroundColor: "#000000",
    show: false,
    icon: path.join(__dirname, "icon.ico"),
    webPreferences: {
      // Set the path of an additional "preload" script that can be used to
      // communicate between node-land and browser-land.
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      sandbox: true,
      webSecurity: true,
      experimentalFeatures: false,
      devTools: false, // Do not change. It's important for security that devtools are disabled by default
    },
  });

  // Auto grant device permission if served in electron container as electron is missing the chrome dialog
  // https://www.electronjs.org/docs/latest/api/session#sessetdevicepermissionhandlerhandler
  mainWindow.webContents.session.setDevicePermissionHandler(details => {
    return (
      details.deviceType === "usb" &&
      (details.origin === "file://" || details.origin === "http://localhost:3000")
    );
  });

  // In production, set the initial browser path to the local bundle generated
  // by the Create React App build process.
  // In development, set it to localhost to allow live/hot-reloading.
  const appURL = app.isPackaged
    ? url.format({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file:",
        slashes: true,
      })
    : "http://localhost:3000";
  mainWindow.loadURL(appURL);
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();

    if (deeplinkURL) {
      mainWindow.webContents.send("deeplinkURL", deeplinkURL);
      deeplinkURL = null;
    } else if (process.platform === "win32" || process.platform === "linux") {
      // Protocol handler for windows & linux
      const argv = process.argv;
      const index = argv.findIndex(arg => arg.startsWith("umami://"));
      if (index !== -1) {
        mainWindow.webContents.send("deeplinkURL", argv[index]);
      }
    }
  });

  mainWindow.webContents.setWindowOpenHandler(details => {
    if (details.url.startsWith("https") || details.url.startsWith("mailto")) {
      shell.openExternal(details.url);
      return { action: "deny" };
    } else {
      return { action: "allow" };
    }
  });

  // Emitted when the window is closed.
  mainWindow.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

app.commandLine.appendSwitch("disable-features", "OutOfBlinkCors");

if (!app.isDefaultProtocolClient("umami")) {
  // Define custom protocol handler. Deep linking works on packaged versions of the application!
  app.setAsDefaultProtocolClient("umami");
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("second-instance", (event, argv, cwd) => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }
    mainWindow.focus();
    // Protocol handler for win32
    // argv: An array of the second instance’s (command line / deep linked) arguments
    if (process.platform === "win32" || process.platform === "linux") {
      // Protocol handler for windows & linux
      const index = argv.findIndex(arg => arg.startsWith("umami://"));
      if (index !== -1) {
        mainWindow.webContents.send("deeplinkURL", argv[index]);
      }
    }
  } else {
    createWindow();
  }
});

app.on("open-url", (_event, url) => {
  if (mainWindow) {
    mainWindow.webContents.send("deeplinkURL", url);
  } else {
    deeplinkURL = url;
    app.whenReady().then(() => {
      createWindow();
    });
  }
});

// This method will be called when Electron has finished its initialization and
// is ready to create the browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();
  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
  // Listen to install-app-update event from UI.
  ipcMain.on("install-app-update", () => autoUpdater.quitAndInstall());
});
