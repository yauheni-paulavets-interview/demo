import { Injectable } from '@angular/core';
import { MapsAPILoader } from '@agm/core';

import { Observable } from 'rxjs/Observable';
import { Subject }    from 'rxjs/Subject';
import { _throw } from 'rxjs/observable/throw';

import { Location } from '../model';

declare var google: any;

//Wraps the google places API
//Used by the related component only
@Injectable()
export class GooglePlacesService {

  private newLocationSource: Subject<any> = new Subject<any>();
  newLocation$ = this.newLocationSource.asObservable();

  constructor(private mapsAPILoader: MapsAPILoader) { }

  setLocationChangeWatch(nativeElement) {
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(nativeElement, {
        types: ["address"]
      });
      autocomplete.addListener("place_changed", () => {
        let place = autocomplete.getPlace();

        if (place.geometry === undefined || place.geometry === null) {
          _throw(place);
        } else 
        {
          let locationName = place.formatted_address;
          let lat = place.geometry.location.lat();
          let lng = place.geometry.location.lng();

          this.newLocationSource.next(new Location(locationName, lng, lat));
        }
        nativeElement.value = '';
      });
    });
  }
}
