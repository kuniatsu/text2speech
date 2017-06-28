const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');
const os = require('os');

// 本番かどうか
const build = true;

if (!build) {
  require('electron-reload')(__dirname);
}

// electronのウィンドウズ
let win = null;

function createWindow() {
  // electronのウィンドウズを初期化
  win = new BrowserWindow({ width: 500, height: 200 });

  // テスト用のメニュー
  if (build) {
    win.setMenu(null);
  }


  // ビルドモード：「npm run build」でビルドされたアプリをロード
  if (build) {
    win.loadURL(url.format({
      pathname: path.join(__dirname, './angular-dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  } else {
    // 開発モード：localhostにあるアプリでをロード、「npm start」を実施する必要があります
    win.loadURL('http://localhost:4200');
  }

  // electronのウィンドを閉じる
  win.on('closed', () => {
    win = null;
  });
});

// アプリの初期化が完了した
app.on('ready', createWindow);

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

// オーディオバッファをファイルとしてダウンロードフォルダに保存
exports.writeFileToDownloadDirectory = (filename, buffer, callback) => {
  fs.writeFile(os.homedir() + '/Desktop/' + filename, buffer, callback);
};
