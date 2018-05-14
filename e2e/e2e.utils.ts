import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo(path) {
    return browser.get(path);
  }

  editCommentFromListView(commentValue) {
    this.getElements('mat-row').first().click();

    let textarea = this.getElement("mat-dialog-container textarea");
    textarea.clear();
    textarea.sendKeys(commentValue);
  }

  switchView() {
    let anchor = this.getElement('app-header a');
    anchor.click();
  }

  getElements(selector) {
    return element.all(by.css(selector));
  }

  getElement(selector) {
    return element(by.css(selector));
  }

  getElementText(selector) {
    return element(by.css(selector)).getText();
  }
}
