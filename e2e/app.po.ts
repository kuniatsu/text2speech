import { browser, $$ } from 'protractor';

export class Text2speechPage {
  navigateTo() {
    return browser.get('/');
  }

  getTextFields() {
    return $$('input[type=text]');
  }

  getSelectFields() {
    return $$('select');
  }

  getSubmitFields() {
    return $$('input[type=submit]');
  }
}
