import { ReadcontentfilePage } from './app.po';

describe('readcontentfile App', () => {
  let page: ReadcontentfilePage;

  beforeEach(() => {
    page = new ReadcontentfilePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
