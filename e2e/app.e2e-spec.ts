import { Text2speechPage } from './app.po';

describe('text2speech App', () => {
  let page: Text2speechPage;

  beforeEach(() => {
    page = new Text2speechPage();
  });

  it('has enough form fields', () => {
    page.navigateTo();
    page.getTextFields().then(textFields => expect(textFields.length).toEqual(4));
    page.getSelectFields().then(selectFields => expect(selectFields.length).toEqual(4));
    page.getSubmitFields().then(submitFields => expect(submitFields.length).toEqual(1));


  });
});
