import { Component, OnInit, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';

import { AttachmentDao } from '../../dao';

import { Attachment } from '../../model';

// The expandable attachments section within the dialog
@Component({
  selector: 'app-attachments',
  templateUrl: './attachments.component.html',
  styleUrls: ['./attachments.component.scss']
})
export class AttachmentsComponent implements OnInit {

  //Parent location id.
  @Input()
  locationId;

  //Uses material table.
  displayedColumns = ['Actions', 'Name', 'Processing'];
  attachments = [];
  dataSource: MatTableDataSource<Element> = new MatTableDataSource<Element>(this.attachments);

  constructor(private attachmentDao: AttachmentDao) { }

  ngOnInit() {
    this.initTableWithRecords();
    this.listenToNewAttachment();
  }

  //Loads the location related attachments
  private initTableWithRecords() {
    let byParentSubscription = this.attachmentDao.getByParentId(this.locationId)
      .subscribe((nativeSfAttachments) => {
        byParentSubscription.unsubscribe();
        this.attachments = nativeSfAttachments.map((nativeSfAttach) => {
          let wrappedAttach =  new Attachment();
          wrappedAttach.attachment = nativeSfAttach;
          return wrappedAttach;
        });
        this.syncTable();
      });
  }

  //Handles new attachments:
  //1) Shows preview during the uploading
  //2) Shows the attachment with the link after the upload
  private listenToNewAttachment() {
    this.attachmentDao.newRecords$
                      .subscribe(
                        (newAttachments) => {
                          this.handleNewAttachments(newAttachments);
                        },
                        (failedNewAttachments) => {
                          this.handleNewAttachments(failedNewAttachments);
                        }
                      );
  }

  //1) If there is no attachment preview for the provided item - means the attachment is uploading, show the preview with the spinner
  //2) Otherwise, if the attachemnt hasn't get the id - the upload was failed, shows temp error message
  //3) Otherwise success
  //P.S Salesforce specific, standard 'Description' field is used as temp storage for local id, to be able to substitute the preview with the spinner
  private handleNewAttachments(newAttachments) {

    let tempAttachment = newAttachments[0];
    let tempAttachParetnId = tempAttachment.ParentId ? tempAttachment.ParentId : tempAttachment.attachment.ParentId;
    if (tempAttachParetnId != this.locationId) {
      return;
    }

    newAttachments.forEach((newAttachment, newAttachIndex) => {
      let oldAttachIndex = this.attachments.findIndex((oldAttachment) => {
        let newAttachDescr = 'Description' in newAttachment ? newAttachment.Description : newAttachment.attachment.Description;
        return newAttachDescr === oldAttachment.attachment.Description;
      });
      if (oldAttachIndex === -1) {
        this.attachments.push(newAttachment);
        this.syncTable();
      } else {
        this.attachments[oldAttachIndex].isProcessing = false;
        if (!newAttachment.Id) {
          this.attachments[oldAttachIndex].errorTakesPlace = true;
          this.delayRemovalFromUI(newAttachment.Description);
        } else {
          this.attachments[oldAttachIndex].attachment.file = null;
          this.attachments[oldAttachIndex].attachment = newAttachment;
        }
      }
    });
  }

  //In case of the error - shows temporary message within the UI
  delayRemovalFromUI(tempId) {
    Observable.of(tempId)
              .delay(3000)
              .subscribe((oldAttachIndex) => {
                let index = this.attachments.findIndex((oldAttachment) => {
                  return tempId === oldAttachment.attachment.Description;
                });
                this.attachments.splice(index, 1);
                this.syncTable();
              });
  }

  //The way to refresh material table
  private syncTable() {
    this.dataSource.data = this.attachments;
  }

  //Deletes the attachment:
  //1) Marks it as processing to replace the link view with the uploading view
  deleteAttachment(element) {
    let oldAttachIndex = this.attachments.findIndex((oldAttachment) => {
      return !oldAttachment.isProcessing && !oldAttachment.errorTakesPlace && element.attachment.Id === oldAttachment.attachment.Id;
    });
    element.isProcessing = true;
    this.attachmentDao.delete(element.attachment)
                      .subscribe(
                        (attachment) => {
                          element.isProcessing = false;
                          this.attachments.splice(oldAttachIndex, 1);
                          this.syncTable();
                        },
                        (error) => {
                          //In case of the error - shows temporary message
                          element.isProcessing = false;
                          element.errorTakesPlace = true;
                          this.tempErrorMsg(element);
                        }
                      );
  }

  private tempErrorMsg(element) {
    Observable.of(element)
              .delay(3000)
              .subscribe((oldAttachIndex) => {
                element.errorTakesPlace = false;
                this.syncTable();
              });
  }

}
