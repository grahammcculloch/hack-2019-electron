const electron = require('electron');
const fontList = require('font-list');
const karaoke = require('./karaoke');
const { getProjectStructure } = require('./hear-this');
// Module to control application life.
const { app, ipcMain, shell } = electron;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
const spawn = require('child_process').spawn;

const path = require('path');
const url = require('url');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

let hearThisProjects;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: { nodeIntegration: true },
  });

  // and load the index.html of the app.
  const startUrl =
    process.env.ELECTRON_START_URL ||
    url.format({
      pathname: path.join(__dirname, '/../build/index.html'),
      protocol: 'file:',
      slashes: true,
    });
  mainWindow.loadURL(startUrl);
  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

function handleGetFonts() {
  ipcMain.on('did-start-getfonts', async event => {
    console.log('Getting system fonts');
    fontList
      .getFonts()
      .then(fonts => {
        event.sender.send(
          'did-finish-getfonts',
          // Font names with spaces are wrapped in quotation marks
          fonts.map(font => font.replace(/^"|"$/g, '')).sort(),
        );
      })
      .catch(err => {
        event.sender.send('did-finish-getfonts', err);
      });
  });
}

function handleGetProjects() {
  ipcMain.on('did-start-getprojectstructure', async event => {
    console.log('Getting project structure');
    hearThisProjects = getProjectStructure();
    event.sender.send('did-finish-getprojectstructure', hearThisProjects);
  });
}

function handleOpenOutputFolder() {
  ipcMain.on('open-output-folder', async (event, outputFile) => {
    shell.showItemInFolder(outputFile);
  });
}

function handleSubmission() {
  ipcMain.on('did-start-conversion', async (event, args) => {
    console.log('Starting command line', args);
    const { hearThisFolder, backgroundFile, font, outputFile } = args;
    let result = await karaoke.execute(
      hearThisFolder,
      backgroundFile,
      font,
      outputFile,
    );

    const retArgs =
      typeof result === 'string'
        ? { outputFile: result }
        : { error: { message: result ? result.toString() : 'Unknown error' } };
    console.log('Command line process finished', retArgs);
    event.sender.send('did-finish-conversion', retArgs);
  });
  // Note: this is not called from the UI at the moment:
  ipcMain.on('did-start-render', (event, args) => {
    console.log('Starting command line', args);
    const melt = spawn('C:\\Program Files\\Shotcut\\melt.exe', ['-h']);
    melt.stdout.on('data', data => {
      console.log(`stdout: ${data}`);
    });
    melt.on('close', code => {
      console.log(`melt exit code ${code}`);
      const retArgs = { outputFile: 'render.mp4' };
      event.sender.send('did-finish-render', retArgs);
    });
    // setTimeout(() => {
    //   const retArgs = { outputFile: 'render.mp4' };
    //   console.log('Command line process finished', retArgs);
    //   event.sender.send('did-finish-render', retArgs);
    // }, 2000);
  });
}

function installReactDevTools() {
  try {
    // Ref: https://electronjs.org/docs/tutorial/devtools-extension
    // TODO: The following path is user-specific!!
    const reactDevToolsExtensionPath =
      'C:UsersadminAppDataLocalGoogleChromeUser DataDefaultExtensions\fmkadmapgofadopljbjfkapdkoienihi\4.2.0_0';
    // BrowserWindow.addDevToolsExtension(reactDevToolsExtensionPath);
  } catch (err) {
    console.error(err);
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow();
  handleSubmission();
  handleGetProjects();
  handleGetFonts();
  handleOpenOutputFolder();
  installReactDevTools();
});

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function() {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
