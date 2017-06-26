const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

const build = true;

if (!build) {
  require('electron-reload')(__dirname);
}

// electronのウィンドウズ
let win = null;

// アプリの初期化が完了した
app.on('ready', () => {

  // electronのウィンドウズを初期化
  win = new BrowserWindow({ width: 500, height: 200 });
  win.setMenu(null);
  // ビルドモード：「npm run build」でビルドされたアプリをロード
  if (build) {
    const pathToEntry = process.platform === 'darwin' ? './Contents/angular-dist/index.html' : './angular-dist/index.html';
    win.loadURL(url.format({
      pathname: path.join(__dirname, pathToEntry),
      protocol: 'file:',
      slashes: true
    }));
  } else {
    // 開発モード：localhostにあるアプリでをロード
    win.loadURL('http://localhost:4200');
  }

  // electronのウィンドを閉じる
  win.on('closed', () => {
    win = null;
  });
});

// アプリがアクティブ化された
app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

// 全てのウィンドウズを閉じられたときに、環境がOSXでなければ、アプリを終了
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
