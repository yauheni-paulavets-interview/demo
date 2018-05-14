import { Injectable, Inject } from '@angular/core';

import { Restangular } from 'ngx-restangular';

import { Dao } from './dao';

@Injectable()
export class LocationDao extends Dao{

  constructor(protected restangular: Restangular) {
    super(restangular);
    this.restLocator = 'location';
  }

}
