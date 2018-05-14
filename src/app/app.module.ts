//Launch dev server to be used in conjuction with salesforce: ng serve --ssl --public-host=https://localhost:4200/ --deploy-url=https://localhost:4200/
//Build: ng build --target=production --base-href /AngularDemo/
//json-server: json-server --watch db.json --delay=1000

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AgmCoreModule } from '@agm/core';
import { RestangularModule, Restangular } from 'ngx-restangular';
import { RouteReuseStrategy } from '@angular/router';
import { AppRoutingModule } from './routing/routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material/material.module';

import { 
  LocationDao,
  AttachmentDao
} from './dao';

import { 
  FileReaderService,
  GooglePlacesService,
  FilterLocationService,
  LocationStorageService
} from './services';

import { CustomReuseStrategy } from './routing/custom-reuse-strategy';

import { 
  googleApiKey,
  defaultLocation,
  defaultZoom,
  pageSizeOptions,
  routesToCache,
  genericError
} from './constants';

import { RestangularConfigFactory } from './configs';

import { AppComponent } from './app.component';
import {
  LocationsMapComponent,
  LocationsListComponent,
  HeaderComponent,
  GooglePlacesComponent,
  FilterNewLocationActionsComponent,
  LocationFormComponent,
  FileUploadComponent,
  AttachmentsComponent
} from './components';

import {
  DroppableDirective,
  HighlightDirective
} from './directives';

import {APP_BASE_HREF} from '@angular/common';


@NgModule({
  declarations: [
    AppComponent,
    LocationsMapComponent,
    LocationsListComponent,
    HeaderComponent,
    GooglePlacesComponent,
    FilterNewLocationActionsComponent,
    LocationFormComponent,
    HighlightDirective,
    FileUploadComponent,
    DroppableDirective,
    AttachmentsComponent
  ],
  imports: [
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    AppRoutingModule,
    RestangularModule.forRoot(RestangularConfigFactory),
    AgmCoreModule.forRoot({
      apiKey: googleApiKey,
      libraries: ['places']
    })
  ],
  providers: [
    LocationDao,
    AttachmentDao,
    FileReaderService,
    GooglePlacesService,
    FilterLocationService,
    LocationStorageService,
    {provide: RouteReuseStrategy, useClass: CustomReuseStrategy},
    {provide: 'DefaultLocation', useValue: defaultLocation},
    {provide: 'DefaultZoom', useValue: defaultZoom},
    {provide: 'PageSizeOptions', useValue: pageSizeOptions},
    {provide: 'RoutesToCache', useValue: routesToCache},
    {provide: 'GenericError', useValue: genericError},
    {provide: APP_BASE_HREF, useValue: '/AngularDemo/'}
  ],
  entryComponents: [
    LocationFormComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
