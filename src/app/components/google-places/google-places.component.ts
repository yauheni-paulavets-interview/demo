import { ElementRef, Component, ViewChild, OnInit, OnDestroy, Inject, NgZone } from '@angular/core';
import { HttpResponseBase } from '@angular/common/http';
import { FormControl } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';

import { GooglePlacesService } from '../../services';
import { LocationDao } from '../../dao';

import { Location } from '../../model';

//Google places API wrapper
@Component({
  selector: 'app-google-places',
  templateUrl: './google-places.component.html',
  styleUrls: ['./google-places.component.scss']
})
export class GooglePlacesComponent implements OnInit, OnDestroy {
  @ViewChild("search")
  public searchElementRef: ElementRef;
  private locationChangeSubscription: Subscription;

  errorMessageTakesPlace: boolean = false;

  constructor(private googlePlacesService: GooglePlacesService,
              private locationDao: LocationDao,
              private ngZone: NgZone,
              @Inject('GenericError') public errorMsg: string) {}

  //Establishes, via the servies, the event handler
  ngOnInit() {
    this.googlePlacesService.setLocationChangeWatch(this.searchElementRef.nativeElement);
    this.locationChangeSubscription = this.googlePlacesService.newLocation$
        .mergeMap((newLocation) => {
          return  this.locationDao.insert(newLocation, true)
                      .catch((error) => {
                        return Observable.of(error);
                      });
        })
        //Shows temporary error message in case of failure
        .subscribe(
          (newLocation) => {
            this.ngZone.run(() => {
              if (newLocation instanceof HttpResponseBase) {
                this.errorMessageTakesPlace = true;
                this.tempErrorMsg();
              }
            });
          }
        );
  }

  ngOnDestroy() {
    this.locationChangeSubscription.unsubscribe();
  }

  private tempErrorMsg() {
    Observable.of(this.errorMsg)
              .delay(3000)
              .subscribe(() => {
                this.errorMessageTakesPlace = false
              });
  }
}
