// 簡単なテスト、「npm run test」で実現でき
import { TestBed, async } from '@angular/core/testing';
import { FormsModule }   from '@angular/forms';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [FormsModule]
    }).compileComponents();
  }));

  // アプリが正しく作れてもらうかどうか
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
