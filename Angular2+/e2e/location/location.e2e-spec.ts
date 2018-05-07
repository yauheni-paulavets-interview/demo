import {  
    browser, 
    element, 
    by
}
from 'protractor'; 

import { setupDb } from './../db.setup';

import { AppPage } from '../e2e.utils';

describe('Location', () => {
  let page: AppPage;

  beforeAll(() => {
    setupDb();
  });

  beforeEach(() => {
    page = new AppPage();
  });

  it('Should open the dialog upon the row click', () => {
    page.navigateTo('/');
    page.switchView();

    expect(page.getElements('mat-dialog-container').count()).toEqual(0);
    page.getElements('mat-row').first().click();
    expect(page.getElements('mat-dialog-container').count()).toEqual(1);
  });

  it('Should have save button be disabled initially', () => {
    page.navigateTo('/');
    page.switchView();

    page.getElements('mat-row').first().click();

    let submitBtn = page.getElement("mat-dialog-container button[type='submit']");
    expect(submitBtn.isEnabled()).toEqual(false);
  });

  it('Should have save button be enabled upon the related comment change', () => {
    page.navigateTo('/');
    page.switchView();

    let commentValue = 'Test comment';
    page.editCommentFromListView(commentValue);

    let submitBtn = page.getElement("mat-dialog-container button[type='submit']");
    expect(submitBtn.isEnabled()).toEqual(true);
  });

  it('Should persist the changed comment upon submission', () => {
    page.navigateTo('/');
    page.switchView();

    let commentValue = 'Test comment';
    page.editCommentFromListView(commentValue);

    let submitBtn = page.getElement("mat-dialog-container button[type='submit']");
    submitBtn.click();

    browser.refresh();
    let commentCell = page.getElement('mat-row:first-of-type mat-cell:last-child');
    expect(commentCell.getText()).toEqual(commentValue);
  });

  it('Should delete a location from UI as well as from db upon the deletion action', () => {
    page.navigateTo('/');
    page.switchView();

    page.getElements('mat-row').first().click();

    let deleteBtn = page.getElements("mat-dialog-container button").get(2);
    deleteBtn.click();

    expect(page.getElements('mat-row').count()).toEqual(3);
    page.switchView();
    expect(page.getElements('agm-marker').count()).toEqual(3);
    browser.refresh();
    expect(page.getElements('agm-marker').count()).toEqual(3);
  });
});