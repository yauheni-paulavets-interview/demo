import { TestBed, async, fakeAsync, inject, ComponentFixture, tick } from '@angular/core/testing';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AgmCoreModule } from '@agm/core';
import { RestangularModule } from 'ngx-restangular';
import { MaterialModule } from './../../material/material.module';
import { MatTabGroup } from '@angular/material';
import { By } from '@angular/platform-browser';

import { 
  LocationDao
} from './../../dao';

import { 
  GooglePlacesService,
  FilterLocationService
} from './../../services';

import { 
  genericError
} from './../../constants';

import {
  GooglePlacesComponent,
  FilterNewLocationActionsComponent
} from './../../components';

describe('FilterNewLocationActionsComponent', () => {

  let fixture: ComponentFixture<FilterNewLocationActionsComponent>;
  let filterNewLocationActionsComponent: FilterNewLocationActionsComponent;
  let nativeElement: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({

      declarations: [
        GooglePlacesComponent,
        FilterNewLocationActionsComponent
      ],
      imports: [
        MaterialModule,
        BrowserAnimationsModule,
        RestangularModule,
        AgmCoreModule.forRoot({
          libraries: ['places']
        })
      ],
      providers: [
        LocationDao,
        GooglePlacesService,
        FilterLocationService,
        {provide: 'GenericError', useValue: genericError}
      ],
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(FilterNewLocationActionsComponent);
      filterNewLocationActionsComponent = fixture.componentInstance;
      fixture.detectChanges();
      nativeElement = fixture.debugElement.nativeElement;
    });
  }));

  afterEach(() => {
    fixture.destroy();
  });

  it('should create the component', () => {
    expect(filterNewLocationActionsComponent).toBeTruthy();
  });

  it('should default to the first tab', () => {
    checkSelectedIndex(0, fixture);
  });

  it('will properly load content on first change detection pass', () => {
    expect(nativeElement.querySelectorAll('.mat-tab-body')[0].querySelectorAll("input[placeholder='Add New Address']").length).toBe(1);
  });

  it('should notify the observers upon filter input change', fakeAsync(inject([FilterLocationService], (filterLocationService) => {
    // select the second tab
    let tabLabel = fixture.debugElement.queryAll(By.css('.mat-tab-label'))[1];
    tabLabel.nativeElement.click();
    
    checkSelectedIndex(1, fixture);
    tick();

    let tabContentElement = fixture.debugElement.query(By.css(`mat-tab-body:nth-of-type(2)`)).nativeElement;
    let expectedContent = tabContentElement.querySelectorAll("input[placeholder='Filter Location']");
    expect(expectedContent.length).toBe(1);
    let filterInput: any = expectedContent[0];
    let newFilterValue = 'test';
    filterInput.value = newFilterValue;

    spyOn(filterLocationService, 'pushNewFilterValue');
    var event = new KeyboardEvent('keyup', {
      view: window,
      bubbles: true,
      cancelable: true
    });
    filterInput.dispatchEvent(event);

    expect(filterLocationService.pushNewFilterValue).toHaveBeenCalled();

    filterLocationService.filterLocation$.subscribe((filterValue) => {
      expect(filterValue).toEqual(newFilterValue);
    });
  })));

  function checkSelectedIndex(expectedIndex: number, fixture: ComponentFixture<any>) {
    fixture.detectChanges();

    let tabComponent: MatTabGroup = fixture.debugElement
        .query(By.css('mat-tab-group')).componentInstance;
    expect(tabComponent.selectedIndex).toBe(expectedIndex);

    let tabLabelElement = fixture.debugElement
        .query(By.css(`.mat-tab-label:nth-of-type(${expectedIndex + 1})`)).nativeElement;
    expect(tabLabelElement.classList.contains('mat-tab-label-active')).toBe(true);

    let tabContentElement = fixture.debugElement
        .query(By.css(`mat-tab-body:nth-of-type(${expectedIndex + 1})`)).nativeElement;
    expect(tabContentElement.classList.contains('mat-tab-body-active')).toBe(true);
  }
});

