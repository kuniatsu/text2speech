// https://docs.microsoft.com/en-us/azure/cognitive-services/speech/api-reference-rest/bingvoiceoutput
// https://azure.microsoft.com/en-us/services/cognitive-services/speech/
// https://azure.microsoft.com/en-us/try/cognitive-services/my-apis/

declare global { interface Window { require: Function; } }
import request from 'request';
import async from 'async';

// ユーザーが決める場合、ダイアログが出て、自動に動作したら、ファイルDesktopに置く
const USER_CHOOSE_DOWNLOAD_PATH = false;
let downloadHandler;

if (USER_CHOOSE_DOWNLOAD_PATH) {
  downloadHandler = (filename, buffer) => {
    const url = URL.createObjectURL(new Blob([buffer]));
    let downloadLink = document.createElement("a");
    downloadLink.download = filename;
    downloadLink.href = url;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
  };
} else {
  // メインプロセスからの関数をインポート
  downloadHandler = window.require('electron').remote.require('./main').writeFileToDownloadDirectory;
}
// ログインしてから、https://azure.microsoft.com/en-us/try/cognitive-services/my-apis/　で登録できる
const BingSpeechAPIKey = '6c942d415b884e99b1fcc20a43b7a873';

// データをmp3ファイルとしてダウンロード
function downloadTextToSpeechFile(filename, blob) {
  const url = URL.createObjectURL(blob);
  let downloadLink = document.createElement("a");
  downloadLink.download = filename;
  downloadLink.href = url;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
}

// "[" や "?" などのシンボルでAPIにリクエストしてから、このパターンを取れる
const silentSound = [255,243,72,196,0,0,0,3,72,0,0,0,0,76,65,77,69,51,46,57,57,46,53,0];
// silentSoundのエレメントが１バイトとなり、32kbitrate = 4000 バイト / 秒
// バイト / (バイト / 秒) ＝ 秒
const silentLengthInSec = silentSound.length / 4000;

// オーディオバッファを伸ばす
function concatAudioBuffer(source, toConcat) {
  const tmp = new Uint8Array(source.length + toConcat.length);
  tmp.set(source);
  tmp.set(toConcat, source.length);
  return tmp;
}

//　https://www.microsoft.com/cognitive-services/en-us/Speech-api/documentation/API-Reference-REST/BingVoiceOutput#Http
function textToSpeech(input) {

  // オーディオバッファ
  let content = new Uint8Array(0);

  // 順番で、インプットを処理
  async.eachSeries(input, (inp, nextInput) => {

    // 普通のボイス
    if (inp.voice.length) {
      // アクセスキーを取る
      request({
        method: 'POST',
        url: 'https://api.cognitive.microsoft.com/sts/v1.0/issueToken',
        headers: {
          'Ocp-Apim-Subscription-Key': BingSpeechAPIKey
        }
      }, (err, res, accessKey) => {
        if (err) console.error(err);

        // Text2SpeechAPIにリクエスト
        request({
          method: 'POST',
          url: 'https://speech.platform.bing.com/synthesize',
          headers: {
            'Authorization': 'Bearer ' + accessKey,
            'X-Microsoft-OutputFormat': 'audio-16khz-32kbitrate-mono-mp3',
            'Content-Type': 'application/ssml+xml',
          },
          encoding: null,
          body: `<speak version='1.0' xml:lang='en-US'><voice name='Microsoft Server Speech Text to Speech Voice (${inp.voice})'>${inp.text}</voice></speak>`
        }, (err, res, body) => {
          // 結果をオーディオバッファに追加
          content = concatAudioBuffer(content, body);
          nextInput();
        });
      });
    }
    // 無音
    else {
      const waitInSec = parseInt(inp.text, 10);
      if (!isNaN(waitInSec) && waitInSec < 10) {
        // 無音分を追加
        for (let i = 0; i < waitInSec / silentLengthInSec; i++) {
          content = concatAudioBuffer(content, silentSound);
        }
        nextInput();
      }
    }
  }, err => { // インプットの処理が完了した
    if (err) console.log(err);

    // ファイル名を作成
    let filename = input[0].text;
    for (let i = 1; i < input.length; i++) {
      filename += '_' + input[i].text;
    }

    // オーディオバッファをMP3ファイルとしてダウンロード
    downloadHandler(filename + '.mp3', content, err => {
      if (err) {
        alert('エラーが発生しました！');
      } else {
        alert('ファイル作成が完了しました！');
      }
    });
  });
}

export default textToSpeech;
