import { Component, OnInit } from '@angular/core';
import { FilterLocationService } from '../../services/filter-location.service';

//'Add new address'/'Filter location' inputs
@Component({
  selector: 'app-filter-new-location-actions',
  templateUrl: './filter-new-location-actions.component.html',
  styleUrls: ['./filter-new-location-actions.component.scss']
})
export class FilterNewLocationActionsComponent implements OnInit {

  constructor(private filterLocationService: FilterLocationService) {}

  ngOnInit() {
  }

  //Provides the filter value via the service, which in it turns notifies intersted in components(list/map)
  applyFilter(filterValue: string) {
      this.filterLocationService.pushNewFilterValue(filterValue);
  }

}
