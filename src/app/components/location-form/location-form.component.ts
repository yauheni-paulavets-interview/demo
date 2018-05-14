import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { LocationDao } from '../../dao';
import { Location } from '../../model';

//Contains the location related info + related attachments list(with upload). Triggered within the material dialog.
@Component({
  selector: 'app-location-form',
  templateUrl: './location-form.component.html',
  styleUrls: ['./location-form.component.scss']
})
export class LocationFormComponent implements OnInit, OnDestroy {

  locationForm: FormGroup;
  contextLocation: Location;
  inProgress: boolean = false;
  submitDisabled: boolean = true;

  errorMessageTakesPlace: boolean = false;

  private reactiveFormSubscription: Subscription;
  private deleteLocationSubscription: Subscription;
  private updateLocationSubscription: Subscription;

  constructor(private fb: FormBuilder,
              private locationDao: LocationDao,
              public dialogRef: MatDialogRef<LocationFormComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              @Inject('GenericError') public errorMsg: string) {}

  ngOnInit() {
    this.contextLocation = this.data.location;

    //Reactive form for the context location
    this.createForm();
  }

  ngOnDestroy() {
    this.reactiveFormSubscription.unsubscribe();
    if (this.deleteLocationSubscription) {
      this.deleteLocationSubscription.unsubscribe();
    }
    if (this.updateLocationSubscription) {
      this.updateLocationSubscription.unsubscribe();
    }
  }

  createForm() {
    this.locationForm = this.fb.group({
      name__c: this.contextLocation.name__c,
      comment__c: this.contextLocation.comment__c
    });

    this.reactiveFormSubscription = this.locationForm.valueChanges.subscribe(val => {
      let currentValue = this.contextLocation.comment__c ? this.contextLocation.comment__c : '';
      this.submitDisabled = currentValue == this.locationForm.value.comment__c;
    });
  }

  //Via the service, deletes the location
  deleteLocation() {
    this.inProgress = true;
    this.deleteLocationSubscription = this.locationDao.delete(this.contextLocation, true)
    .subscribe(
      () => {
        this.inProgress = false;
        this.dialogRef.close();
      },
      //In case of the error shows the temporary error message.
      () => {
        this.errorMessageTakesPlace = true;
        this.inProgress = false;
        this.tempErrorMsg();
      }
    );
  }

  //Via the service, inserts the location
  onSubmit() {
    this.inProgress = true;

    let prevCommentValue =  this.contextLocation.comment__c;
    this.contextLocation.comment__c = this.locationForm.value.comment__c;
    this.updateLocationSubscription = this.locationDao.update(this.contextLocation, true)
    .subscribe(
      () => {
        this.inProgress = false;
        this.dialogRef.close();
      },
      //In case of the error shows the temporary error message.
      () => {
        this.errorMessageTakesPlace = true;
        this.inProgress = false;
        this.locationForm.patchValue({
          comment__c: prevCommentValue
        });
        this.contextLocation.comment__c = prevCommentValue;
        this.tempErrorMsg();
      }
    );
  }

  private tempErrorMsg() {
    Observable.of(this.errorMsg)
              .delay(3000)
              .subscribe(() => {
                this.errorMessageTakesPlace = false
              });

  }
}
