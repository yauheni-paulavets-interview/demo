import { Routes } from '@angular/router';

import { 
  LocationsMapComponent,
  LocationsListComponent 
} from '../components';

export const routes: Routes = [
  { path: 'map',  component: LocationsMapComponent, data: {key: "map"} },
  { path: 'list',  component: LocationsListComponent, data: {key: "list"} },
  { path: '', redirectTo: '/map', pathMatch: 'full' }
];