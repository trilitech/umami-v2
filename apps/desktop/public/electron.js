// Module to control the application lifecycle and the native browser window.
const { app, BrowserWindow, shell, net, ipcMain, protocol, clipboard } = require("electron");
const path = require("path");
const url = require("url");
const process = require("process");
const { autoUpdater } = require("electron-updater");
const { Level } = require("level");
const log = require("electron-log");
const fs = require("fs");

const APP_PROTOCOL = "app";
const APP_HOST = "assets";

// backupData is used to store the backup data from the previous version of the app
let backupData;

const appURL = app.isPackaged
  ? url.format({
      pathname: `${APP_HOST}/index.html`,
      protocol: `${APP_PROTOCOL}:`,
      slashes: true,
    })
  : "http://localhost:3000";

protocol.registerSchemesAsPrivileged([
  {
    scheme: APP_PROTOCOL,
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
    },
  },
]);

// Configure electron-log
log.transports.file.resolvePathFn = () => path.join(app.getPath("userData"), "umami-desktop.log");

async function createBackupFromPrevDB() {
  const dbPath = path.normalize(path.join(app.getPath("userData"), "Local Storage", "leveldb"));
  const backupPath = path.normalize(
    path.join(app.getPath("userData"), "Local Storage", "backup_leveldb.json")
  );

  if (!fs.existsSync(dbPath)) {
    log.error("LevelDB database not found at path. Code:EM01", dbPath);
    return;
  }

  if (fs.existsSync(backupPath)) {
    log.info("Backup file already exists. Skipping migration.");
    return;
  }

  const db = new Level(dbPath);

  try {
    log.info("Opening the db");
    await db.open();
    log.info("DB is opened");

    const storage = {};

    // Function to clean up the string (removing non-printable chars)
    function cleanString(str) {
      str = str.replace(/[\x00\x01\x17\x10\x0f]/g, "");

      return str;
    }

    const KEYS_TO_MIGRATE = ["_file://\x00\x01persist:accounts", "_file://\x00\x01persist:root"];
    const ROOT_KEYS_TO_MIGRATE = [
      "batches",
      "beacon",
      "networks",
      "contacts",
      "protocolSettings",
      "_persist",
    ];

    const extractKeys = json => {
      const regexp = /"([^"]+)":("[^"\\]*(?:\\.[^"\\]*)*"|{[^}]+})/g;

      const result = {};
      const matches = json.matchAll(regexp);

      for (const [_, key, value] of matches) {
        if (ROOT_KEYS_TO_MIGRATE.includes(key)) {
          try {
            // Try to parse the value if it's a valid JSON
            result[key] = JSON.parse(value);
          } catch {
            // If parsing fails, store as raw string
            result[key] = value.replace(/^"|"$/g, "");
          }
        }
      }

      return result;
    };

    for await (const [_key, value] of db.iterator()) {
      if (KEYS_TO_MIGRATE.includes(_key)) {
        let cleanedValue = cleanString(value);

        const key = _key.includes("_file://\x00\x01persist:root")
          ? "persist:root"
          : "persist:accounts";

        try {
          storage[key] = JSON.parse(cleanedValue);
        } catch (_) {
          // Store as raw value if JSON parsing fails
          storage[key] = cleanedValue;
        }
      }
    }

    if (Object.keys(storage).length === 0) {
      log.info("No data found to migrate. Code:EM02");
      return;
    }

    const preparedStorage = {
      ...storage,
      "persist:root": extractKeys(storage["persist:root"]),
    };

    backupData = preparedStorage;

    // Write storage object to JSON file
    try {
      fs.writeFileSync(backupPath, JSON.stringify(preparedStorage, null, 2), "utf-8");
      log.info("Backup successfully created at:", backupPath);
    } catch (err) {
      log.error("Error during LevelDB backup creation. Code:EM2.", err);
    }
  } catch (err) {
    log.error("Error during key migration. Code:EM4.", err);
  } finally {
    db.close().catch(err => {
      log.error("Error closing the database. Code:EM5", err);
    });
  }
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let deeplinkURL;

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
      (details.origin === `${APP_PROTOCOL}://${APP_HOST}` ||
        details.origin === "http://localhost:3000")
    );
  });

  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": ["script-src 'self'"],
      },
    });
  });

  mainWindow.webContents.session.setPermissionCheckHandler((_, permission) => {
    switch (permission) {
      case "usb":
      case "clipboard-sanitized-write":
      case "background-sync":
      case "accessibility-events":
        return true;
      default:
        return false;
    }
  });

  mainWindow.webContents.session.setPermissionRequestHandler((_, permission, callback) => {
    switch (permission) {
      case "clipboard-sanitized-write":
      case "clipboard-read":
        callback(true);
        break;
      default:
        callback(false);
    }
  });

  mainWindow.webContents.session.webRequest.onBeforeRequest((details, callback) => {
    if (details.url.startsWith("http://")) {
      return callback({ cancel: true });
    }
    callback({});
  });

  protocol.handle(APP_PROTOCOL, async req => {
    try {
      const uri = new URL(decodeURI(req.url));
      const pathname = uri.pathname === "/" ? "/index.html" : uri.pathname;
      if (
        req.url.includes("..") || // relative paths aren't allowed
        uri.protocol !== `${APP_PROTOCOL}:` || // protocol mismatch
        !pathname || // path must be defined
        uri.host !== APP_HOST // host must match
      ) {
        return new Response("Invalid request", { status: 400 });
      }

      const pathToServe = path.join(__dirname, pathname);
      const relativePath = path.relative(__dirname, pathToServe);
      if (!(relativePath && !relativePath.startsWith("..") && !path.isAbsolute(relativePath))) {
        return new Response("Invalid request", { status: 400 });
      }
      return net.fetch(url.pathToFileURL(pathToServe).href);
    } catch (e) {
      return new Response("Unexpected error in app:// protocol handler.", { status: 500 });
    }
  });

  mainWindow.loadURL(appURL);

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();

    mainWindow.webContents.send("backupData", backupData);

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
    if (details.url.startsWith("https://") || details.url.startsWith("mailto:")) {
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

function start() {
  // Assure single instance
  if (!app.requestSingleInstanceLock()) {
    app.quit();
    return;
  }

  // Check for app updates, download and notify UI if update is available to be installed.
  try {
    autoUpdater.checkForUpdatesAndNotify();
  } catch (e) {
    log.error(e);
  }

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

  app.on("second-instance", (_event, argv) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
      }
      mainWindow.focus();
      // Protocol handler for win32
      // argv: An array of the second instance's (command line / deep linked) arguments
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
      app.whenReady().then(createWindow);
    }
  });

  // This method will be called when Electron has finished its initialization and
  // is ready to create the browser windows.
  // Some APIs can only be used after this event occurs.
  app.whenReady().then(async () => {
    // Execute createBackupFromPrevDB at the beginning
    try {
      await createBackupFromPrevDB();
    } catch (error) {
      log.error("Error has occured while migrating the app", error);
    }

    createWindow();
  });

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  // Send event to UI when app update is ready to be installed.
  // If the update installation won't be triggered by the user, it will be applied the next time the app starts.
  autoUpdater.on("update-downloaded", event => {
    log.info(`Umami update ${event.version} downloaded and ready to be installed`, url);
    return mainWindow.webContents.send("app-update-downloaded");
  });

  // Listen to install-app-update event from UI, start update on getting the event.
  ipcMain.on("install-app-update", () => autoUpdater.quitAndInstall());

  ipcMain.on("clipboard-write", (_, text) => {
    clipboard.writeText(text);
  });

  ipcMain.on("clipboard-clear", () => {
    clipboard.clear();
  });
}

start();
