import { TestBed, async, inject, ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';

import { MockRouter } from './mocks';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AgmCoreModule } from '@agm/core';
import { RestangularModule, Restangular } from 'ngx-restangular';
import { AppRoutingModule } from './routing/routing.module';
import { MaterialModule } from './material/material.module';

import { 
  LocationDao
} from './dao';

import { 
  GooglePlacesService,
  FilterLocationService
} from './services';

import { 
  defaultLocation,
  defaultZoom,
  pageSizeOptions,
  genericError
} from './constants';

import { AppComponent } from './app.component';
import {
  LocationsMapComponent,
  LocationsListComponent,
  HeaderComponent,
  GooglePlacesComponent,
  FilterNewLocationActionsComponent
} from './components';

describe('AppComponent', () => {

  let fixture: ComponentFixture<AppComponent>;
  let appComponent: AppComponent;
  let nativeElement: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({

      declarations: [
        AppComponent,
        LocationsMapComponent,
        LocationsListComponent,
        HeaderComponent,
        GooglePlacesComponent,
        FilterNewLocationActionsComponent
      ],
      imports: [
        MaterialModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        RestangularModule,
        AgmCoreModule.forRoot({
          libraries: ['places']
        })
      ],
      providers: [
        LocationDao,
        GooglePlacesService,
        FilterLocationService,
        {provide: 'DefaultLocation', useValue: defaultLocation},
        {provide: 'DefaultZoom', useValue: defaultZoom},
        {provide: 'PageSizeOptions', useValue: pageSizeOptions},
        {provide: 'GenericError', useValue: genericError},
        { provide: Router, useClass: MockRouter }
      ],
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(AppComponent);
      appComponent = fixture.componentInstance;
      fixture.detectChanges();
      nativeElement = fixture.debugElement.nativeElement;
    });
  }));

  afterEach(() => {
    fixture.destroy();
  });

  it('should create the app', () => {
    expect(appComponent).toBeTruthy();
  });

  it('should initialize the initial view as the map view', () => {
    expect(appComponent.isMapView).toBeTruthy();
  });

  it('should set the view flag accordingly with the navigation action', inject([Router], (router: Router) => {
      router.navigateByUrl('/list');
      expect(appComponent.isMapView).toBeFalsy();
  }));

  it(`should apply 'full-height' class for the map view`, () => {
    expect(nativeElement.querySelectorAll('.full-height').length).toEqual(1);
  });

  it(`should not apply 'full-height' class for the list view`, inject([Router], (router: Router) => {
    router.navigateByUrl('/list');
    fixture.detectChanges();
    expect(nativeElement.querySelectorAll('.full-height').length).toEqual(0);
  }));
});
