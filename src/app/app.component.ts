import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import textToSpeech from '../lib/bing';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // サポートされてるボイス
    voices:Array<Object> = [
      { name: '英語・男性', value: 'en-US, BenjaminRUS' },
      { name: '英語・女性', value: 'en-US, JessaRUS' },
      { name: '日本語・男性', value: 'ja-JP, Ichiro, Apollo' },
      { name: '日本語・女性', value: 'ja-JP, Ayumi, Apollo' },
      { name: '無音', value: '' },
    ];

    // サブミットボタンのハンドル
    onSubmit(f: NgForm) {
      console.log(f.value);
      const input = [];
      for (let i = 1; i <= 4; i++) {
        input.push({ text: f.value['text' + i], voice: f.value['voice' + i] });
      }
      textToSpeech(input);
    }
}
