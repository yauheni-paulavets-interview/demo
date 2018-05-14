import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';

import { Subscription } from 'rxjs/Subscription';
import { Subject }    from 'rxjs/Subject';

import { Location } from '../../model';

import { AttachmentDao } from '../../dao';
import { 
  LocationStorageService,
  FilterLocationService
} from '../../services';

import { LocationCommonLogic } from '../locations-common-logic';

declare var google: any;

//Google maps based view
@Component({
  selector: 'app-locations-map',
  templateUrl: './locations-map.component.html',
  styleUrls: ['./locations-map.component.scss']
})
export class LocationsMapComponent extends LocationCommonLogic implements OnInit, OnDestroy {

  private locations: Location[];
  filteredLocations: Location[] = [];

  //To be able to zoom the map upon filtering
  latLngBounds;
  private filterValue: string = '';

  //Component internal Observable
  //To trigger the same recalculation method upon any change
  private locationsSource: Subject<any> = new Subject<any>();
  private locations$ = this.locationsSource.asObservable();

  private allLocationsSubscription: Subscription;
  private modifiedLocationSubscription: Subscription;
  private filterSubscription: Subscription;

  defaultLocation = {
    coordinates__Latitude__s: null,
    coordinates__Longitude__s: null
  };

  constructor(@Inject('DefaultLocation') private defaultLocationConstant,
              @Inject('DefaultZoom') private defaultZoom,
              private filterLocationService: FilterLocationService,
              private locationStorage: LocationStorageService,
              private attachmentDao: AttachmentDao,
              public dialog: MatDialog) {
    //The both view shares the same dialog triggering and filtering logic.
    super(dialog);
  }

  ngOnInit() {
    //New location is provided via the google places input + the related location is persisted in Salesforce
    this.listenToNewLocation();

    //New filter value is provided
    this.listenToNewFilterValue();

    this.locations$.subscribe(() => {
      this.recalculateFilteredAndBounds();
    });
  }

  ngOnDestroy() {
    this.allLocationsSubscription.unsubscribe();
    this.modifiedLocationSubscription.unsubscribe();
    this.filterSubscription.unsubscribe();
  }

  handleMapReady() {
    this.allLocationsSubscription = this.locationStorage.getAllLocations()
    .subscribe(
      (locations) => {
        this.locations = locations;
        this.setCurrentPosition();
        this.locationsSource.next();
      });
  }

  listenToNewLocation() {
    this.modifiedLocationSubscription = this.locationStorage.modifications$.subscribe((newLocation) => {
      this.locationsSource.next();
    });
  }

  private listenToNewFilterValue() {
    this.filterSubscription = this.filterLocationService.filterLocation$.subscribe((filterValue) => {
      filterValue = filterValue.trim();
      this.filterValue = filterValue.toLowerCase();
      this.locationsSource.next();
    });
  }


  //Recalculates bounds + filtered locations
  private recalculateFilteredAndBounds() {
    this.filteredLocations = this.locations.filter((location) => {
      return this.customFilter(location, this.filterValue);
    });
    let coordinates = this.filteredLocations.map((location) => new google.maps.LatLng(location.coordinates__Latitude__s,location.coordinates__Longitude__s));

    this.latLngBounds = new google.maps.LatLngBounds();
    coordinates.forEach((latLng) => this.latLngBounds.extend(latLng));
  }

  //Attempts to obtain the user's coordinates.
  private setCurrentPosition() {
    if ('geolocation' in navigator && !this.filterValue && !this.locations.length) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.defaultLocation.coordinates__Latitude__s = position.coords.latitude;
          this.defaultLocation.coordinates__Longitude__s = position.coords.longitude;
        },
        (position) => {
          this.defaultLocation.coordinates__Latitude__s = this.defaultLocationConstant.coordinates__Latitude__s;
          this.defaultLocation.coordinates__Longitude__s = this.defaultLocationConstant.coordinates__Longitude__s;
        }
      );
    }
  }
}
