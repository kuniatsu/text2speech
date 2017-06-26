const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

// process.envをセット
require('dotenv').config();

// electronの自動再ロード
require('electron-reload')(__dirname);

// electronのウィンドウズ
let win = null;

// アプリの初期化が完了した
app.on('ready', () => {

  // electronのウィンドウズを初期化
  win = new BrowserWindow({ width: 500, height: 200 });
  win.setMenu(null);
  // ビルドモード：「npm run build」でビルドされたアプリをロード
  if (process.env.PACKAGE === 'true') {
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  } else {
    // 開発モード：localhostにあるアプリでをロード
    win.loadURL(process.env.HOST);
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
