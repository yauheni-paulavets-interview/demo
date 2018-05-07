import { Component, OnInit, Inject, ViewChild, OnDestroy } from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource, MatDialog} from '@angular/material';

import { Subscription } from 'rxjs/Subscription';

import { Location } from '../../model';

import { 
  LocationStorageService,
  FilterLocationService
} from '../../services';

import { LocationCommonLogic } from '../locations-common-logic';

//Material table based location view.
@Component({
  selector: 'app-locations-list',
  templateUrl: './locations-list.component.html',
  styleUrls: ['./locations-list.component.scss']
})
export class LocationsListComponent extends LocationCommonLogic implements OnInit, OnDestroy {

  displayedColumns = ['name__c', 'comment__c'];
  private locations = [];
  dataSource: MatTableDataSource<Element> = new MatTableDataSource<Element>(this.locations);
  private dataSourceInitialized: boolean = false;
  pageSize: number;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  private allLocationsSubscription: Subscription;
  private modifiedLocationSubscription: Subscription;
  private filterSubscription: Subscription;

  constructor(@Inject('DefaultZoom') private defaultZoom,
              @Inject('PageSizeOptions') public pageSizeOptions,
              public dialog: MatDialog,
              private filterLocationService: FilterLocationService,
              private locationStorage: LocationStorageService) {
    //The both view shares the same dialog triggering and filtering logic.
    super(dialog);

    //To be able to handle the filtering in the same manner between the both views(honoring one char).
    this.dataSource.filterPredicate = this.customFilter;
  }

  ngOnInit() {
    this.pageSize = this.pageSizeOptions[0];

    //New location is provided via the google places input + the related location is persisted in Salesforce
    this.listenToNewLocation();

    //New filter value is provided
    this.listenToNewFilterValue();

    this.initContextRecords();
    this.dataSource.data = this.locations;
  }

  ngOnDestroy() {
    this.allLocationsSubscription.unsubscribe();
    this.modifiedLocationSubscription.unsubscribe();
    this.filterSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    this.dataSourceInitialized = true;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  //Pulls the all locations from Salesforce
  //Location storage is shared service between both views to don't execute extra server-trips
  private initContextRecords() {
    this.allLocationsSubscription = this.locationStorage.getAllLocations()
    .subscribe(
      (locations) => {
        if (this.dataSourceInitialized === true) {
          this.dataSource.data = locations;
        } else {
          this.locations = locations;
        }
      });
  }
  
  private listenToNewLocation() {
    this.modifiedLocationSubscription = this.locationStorage.modifications$.subscribe(() => {
        this.dataSource.data = this.dataSource.data;
    });
  }

  private listenToNewFilterValue() {
    this.filterSubscription = this.filterLocationService.filterLocation$.subscribe((filterValue) => {
        filterValue = filterValue.trim();
        filterValue = filterValue.toLowerCase();
        this.dataSource.filter = filterValue;
    });
  }
}
