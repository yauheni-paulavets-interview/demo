import {  
    browser, 
    element, 
    by
}
from 'protractor'; 

import { setupDb } from './../db.setup';

import { AppPage } from '../e2e.utils';

describe('Main views', () => {
  let page: AppPage;

  beforeAll(() => {
    setupDb();
  });

  beforeEach(() => {
    page = new AppPage();
  });

  it('Should display map view with 4 pins', () => {
    page.navigateTo('/');
    expect(page.getElement('agm-map')).toBeTruthy();
    expect(page.getElements('agm-marker').count()).toEqual(4);
  });

  it('Should display table with 4 rows upon switch on the list view', () => {
    page.navigateTo('/');
    page.switchView();

    expect(page.getElement('mat-table')).toBeTruthy();
    expect(page.getElements('mat-row').count()).toEqual(4);
  });

  it('Should filter the locations and show the filtered ones only within the both views', () => {
    page.navigateTo('/');
    let tabs = page.getElements('.mat-tab-label');
    let filterTab = tabs.last();
    filterTab.click();
    let filterInput = page.getElement("input[placeholder='Filter Location']");
    filterInput.sendKeys('G');

    expect(page.getElements('agm-marker').count()).toEqual(2);

    page.switchView();

    expect(page.getElements('mat-row').count()).toEqual(2);
  });
});