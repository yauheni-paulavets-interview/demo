import { MatDialog } from '@angular/material';

import { LocationFormComponent } from './location-form/location-form.component';

//Shared between the both views.
export class LocationCommonLogic {

    constructor(public dialog: MatDialog) {}

    public openLocationDialog(row) {
        this.dialog.open(LocationFormComponent, {
            width: '500px', 
            height: '600px',
            data: { 
            location: row 
            }
        });
    } 

    protected customFilter(location, filterValue): boolean {
        return location.name__c.toLowerCase().indexOf(filterValue) > -1 ||
                (location.comment__c && location.comment__c.toLowerCase().indexOf(filterValue) > -1);
    }
}