// main.cjs
const { app, BrowserWindow, Menu, globalShortcut } = require("electron");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");

// Backend location: packaged as chat.py folder inside the app (portable)
const BACKEND_SCRIPT_REL = path.join("chat.py", "api_server.py");
const BACKEND_FOLDER_REL = path.join("chat.py");

const isDev =
  process.env.NODE_ENV !== "production" &&
  (process.env.ELECTRON_DEV === "1" || process.env.ELECTRON_DEV === "true");

// allow manual devtools open via flag or env
const manualOpenDevTools = process.argv.includes("--devtools") || process.env.OPEN_DEVTOOLS === "1";

let backendProcess = null;
let mainWindow = null;
let splash = null;

function getIndexURL() {
  if (isDev) {
    return "http://127.0.0.1:8080/"; // Vite dev server
  }
  // In production, load from resources/app/dist/index.html
  const indexPath = path.join(process.resourcesPath, "app", "dist", "index.html");
  return `file://${indexPath}`;
}

function resolveBackendPaths() {
  // When packaged with asar:false or with chat.py included, resources may be under resources/app or resources
  const candidates = [
    path.join(__dirname, BACKEND_SCRIPT_REL), // typical during development or unpacked
    path.join(process.resourcesPath, "app", BACKEND_SCRIPT_REL), // packaged (resources/app/chat.py/api_server.py)
    path.join(process.resourcesPath, BACKEND_SCRIPT_REL), // fallback (resources/chat.py/api_server.py)
  ];
  const cwdCandidates = [
    path.join(__dirname, BACKEND_FOLDER_REL),
    path.join(process.resourcesPath, "app", BACKEND_FOLDER_REL),
    path.join(process.resourcesPath, BACKEND_FOLDER_REL),
  ];
  const script = candidates.find(p => {
    try { return fs.existsSync(p); } catch (e) { return false; }
  });
  const cwd = cwdCandidates.find(p => {
    try { return fs.existsSync(p); } catch (e) { return false; }
  }) || __dirname;
  return { script, cwd };
}

function startBackend() {
  try {
    const { script: backendScript, cwd: backendCwd } = resolveBackendPaths();

    if (!backendScript) {
      console.error("[main] backend script not found. Tried locations around __dirname and process.resourcesPath.");
      return;
    }

    console.log("[main] backend script resolved to:", backendScript);
    console.log("[main] backend cwd:", backendCwd);

    // Try common python executables. On Windows 'py' launcher is common; on linux/mac use python3 first.
    const candidates = process.platform === "win32" ? ["python", "py", "python3"] : ["python3", "python"];

    let started = false;

    for (const cmd of candidates) {
      try {
        // attempt to spawn the backend using cmd
        console.log(`[main] attempting to start backend with "${cmd}" ...`);
        backendProcess = spawn(cmd, [backendScript], {
          cwd: backendCwd,
          shell: true,
          env: { ...process.env, ELECTRON_DEV: isDev ? "1" : "0" },
          stdio: ["ignore", "pipe", "pipe"],
        });

        // attach listeners early; errors may occur asynchronously
        backendProcess.stdout.on("data", (data) => {
          process.stdout.write(`[backend] ${String(data)}`);
        });

        backendProcess.stderr.on("data", (data) => {
          process.stderr.write(`[backend:error] ${String(data)}`);
        });

        backendProcess.on("error", (err) => {
          console.warn(`[main] spawn error for ${cmd}:`, err && err.message ? err.message : err);
        });

        backendProcess.on("close", (code) => {
          console.log(`[backend] exited with code ${code}`);
          backendProcess = null;
        });

        // assume success if process object exists; some systems still need a short delay to detect failures
        if (backendProcess && backendProcess.pid) {
          console.log(`[main] backend started with ${cmd} (pid ${backendProcess.pid})`);
          started = true;
          break;
        } else {
          backendProcess = null;
        }
      } catch (err) {
        console.warn(`[main] spawn with ${cmd} failed:`, err);
        backendProcess = null;
      }
    }

    if (!started) {
      console.error("[main] Could not start backend. Make sure Python is installed and available as 'python' or 'py' in PATH.");
    }
  } catch (err) {
    console.error("[main] failed to start backend", err);
    backendProcess = null;
  }
}

function stopBackend() {
  if (backendProcess) {
    try {
      backendProcess.kill();
      console.log("[main] backend killed");
    } catch (e) {
      console.error("[main] error killing backend:", e);
    }
    backendProcess = null;
  }
}

function createSplash() {
  splash = new BrowserWindow({
    width: 500,
    height: 350,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    center: true,
    icon: path.join(__dirname, "build", "alice_final_logo.ico"),
    webPreferences: { contextIsolation: true },
  });

  const splashPath = isDev
    ? path.join(__dirname, "splash.html")
    : path.join(process.resourcesPath, "app", "splash.html");

  splash.loadFile(splashPath).catch((err) => {
    console.error("[main] failed to load splash:", splashPath, err);
  });
}

function createMainWindow() {
  try {
    Menu.setApplicationMenu(null);
  } catch (e) {
    console.warn("[main] Menu.setApplicationMenu failed", e);
  }

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    autoHideMenuBar: true,
    show: false,
    icon: path.join(__dirname, "build", "alice_final_logo.ico"),
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  const url = getIndexURL();
  console.log("[main] isDev=", isDev, " loading URL=", url);

  mainWindow
    .loadURL(url)
    .then(() => console.log("[main] loadURL succeeded:", url))
    .catch((err) => console.error("[main] loadURL failed:", err));

  mainWindow.once("ready-to-show", () => {
    if (splash) {
      try { splash.close(); } catch (e) { /* ignore */ }
      splash = null;
    }
    mainWindow.show();
  });

  // Open DevTools in dev or when requested via flag/env
  if (isDev || manualOpenDevTools) {
    try {
      mainWindow.webContents.openDevTools({ mode: "detach" });
    } catch (e) {
      console.warn("[main] openDevTools failed", e);
    }
  }

  // expose toggle via Ctrl+Shift+D (works in dev & prod)
  try {
    globalShortcut.register("Control+Shift+D", () => {
      if (mainWindow) {
        if (mainWindow.webContents.isDevToolsOpened()) {
          mainWindow.webContents.closeDevTools();
        } else {
          mainWindow.webContents.openDevTools({ mode: "detach" });
        }
      }
    });
  } catch (e) {
    console.warn("[main] globalShortcut registration failed", e);
  }

  mainWindow.webContents.on("did-finish-load", () => {
    console.log("[main] did-finish-load URL:", mainWindow.webContents.getURL());
  });
}

app.whenReady().then(() => {
  startBackend();
  createSplash();
  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on("before-quit", () => {
  try { globalShortcut.unregisterAll(); } catch (e) { /* ignore */ }
  stopBackend();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    stopBackend();
    app.quit();
  }
});
