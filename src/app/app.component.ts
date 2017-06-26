import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

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
    }
}
