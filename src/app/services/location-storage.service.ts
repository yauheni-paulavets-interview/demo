import { Injectable, NgZone, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import { Subject }    from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { LocationDao } from '../dao';

import { Location } from '../model';

//The shared service between the both views to don't execute extra server trips(Uses cache based subject)
//Also notifies the views upon a location insertion/deletion
@Injectable()
export class LocationStorageService implements OnDestroy {

  protected modificationsSource: Subject<any> = new Subject<any>();
  modifications$ = this.modificationsSource.asObservable();

  private allRecordsSource: ReplaySubject<any[]> = new ReplaySubject<any[]>();
  private allRecords$ = this.allRecordsSource.asObservable();
  private locations: Location[];

  private newRecordsSubscription: Subscription;
  private deletedRecordsSubscription: Subscription;

  constructor(private locationDao: LocationDao,
              private ngZone: NgZone) { 
    this.establishListeners();
  }

  ngOnDestroy() {
    this.newRecordsSubscription.unsubscribe();
    this.deletedRecordsSubscription.unsubscribe();
  }

  //to don't execute extra server trips(Uses cache based subject)
  getAllLocations() {
    if (!this.locations)
    {
      let allLocationsObservable = this.locationDao.getAll();
      allLocationsObservable.subscribe((locations) => {
        this.locations = locations;
        this.allRecordsSource.next(this.locations);
      });
    }

    return this.allRecords$;
  }

  private establishListeners() {
    //Notifies the views upon a location insertion
    this.newRecordsSubscription = this.locationDao.newRecords$.subscribe((newLocation) => {
      this.ngZone.run(() => {
        this.locations.push(newLocation);
        this.modificationsSource.next();
      });
    });

    //Notifies the views upon a location deletion
    this.deletedRecordsSubscription = this.locationDao.deleteRecords$.subscribe((deletedRecordId) => {
      this.ngZone.run(() => {
        let index = this.locations.findIndex((location) => location.Id === deletedRecordId);
        this.locations.splice(index, 1);
        this.modificationsSource.next();
      });
    });
  }

}
