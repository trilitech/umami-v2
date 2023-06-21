// Module to control the application lifecycle and the native browser window.
const { app, BrowserWindow } = require("electron");
const path = require("path");
const url = require("url");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let deeplinkURL;

// Assure single instance
if (!app.requestSingleInstanceLock()) {
  app.quit();
  return;
}

// Temporary fix broken high-dpi scale factor on Windows (125% scaling)
// info: https://github.com/electron/electron/issues/9691
if (process.platform === "win32") {
  app.commandLine.appendSwitch("high-dpi-support", "true");
  app.commandLine.appendSwitch("force-device-scale-factor", "1");
}

// Enable experimental to activate Web USB support
app.commandLine.appendSwitch("enable-experimental-web-platform-features", true);

// Create the native browser window.
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 1024,
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
      devTools: process.env.NODE_ENV !== "production",
    },
  });

  // Select first ledger device in list as electron is missing the chrome picker
  // https://www.electronjs.org/docs/latest/tutorial/devices#webhid-api
  mainWindow.webContents.session.on("select-hid-device", (event, details, callback) => {
    event.preventDefault();
    if (details.deviceList && details.deviceList.length > 0) {
      callback(details.deviceList[0].deviceId);
    }
  });

  // Auto grant permission if served in electron container as electron is missing the chrome dialog
  // https://www.electronjs.org/docs/latest/api/session#sessetpermissioncheckhandlerhandler
  mainWindow.webContents.session.setPermissionCheckHandler(
    (webContents, permission, requestingOrigin, details) => {
      if (permission === "hid" && details.securityOrigin === "file:///") {
        return true;
      }
    }
  );

  // Auto grant device permission if served in electron container as electron is missing the chrome dialog
  // https://www.electronjs.org/docs/latest/api/session#sessetdevicepermissionhandlerhandler
  mainWindow.webContents.session.setDevicePermissionHandler(details => {
    if (details.deviceType === "hid" && details.origin === "file://") {
      return true;
    }
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

    // Open dev tools for dev builds
    if (process.env.NODE_ENV !== "production") {
      mainWindow.webContents.openDevTools();
    }
  });

  mainWindow.webContents.setWindowOpenHandler(details => {
    if (details.frameName === "_blank") {
      require("electron").shell.openExternal(details.url);
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

app.on("open-url", (event, url) => {
  console.log("open-url", url);
  if (mainWindow) {
    mainWindow.webContents.send("deeplinkURL", url);
  } else {
    deeplinkURL = url;
    createWindow();
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
  app.setAsDefaultProtocolClient("umami")
});
