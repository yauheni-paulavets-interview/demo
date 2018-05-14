import { Injectable } from '@angular/core';

import { Restangular } from 'ngx-restangular';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';

import { Dao } from './dao';
import { Attachment } from '../model';

import { FileReaderService } from '../services';


//Extends with  getByParentId method
//Overrides insert method to be able to read the files via the File API
@Injectable()
export class AttachmentDao extends Dao {

  constructor(protected restangular: Restangular,
              private fileReader: FileReaderService) {
    super(restangular);
    this.restLocator = 'attachment';
  }

  getByParentId(parentId: string): Observable<Attachment[]> {
      return this.restangular.all(this.restLocator).getList({parentId: parentId});
  }

  insert(files, parentId): Observable<any> {
    let attachments: Attachment[] = [];
    for (let i = 0; i < files.length; i++) {
      attachments.push(new Attachment(files[i], parentId));
    }
    this.emitNewRecord(attachments);

    let observable = this.fileReader.readFiles(attachments, parentId)
                                    .mergeMap((readAttachment) => {
                                       return super.insert(readAttachment.attachment)
                                                   .catch((error) => {
                                                     return Observable.of(error.request.body);
                                                   });
                                    });
    observable
    .subscribe(
      (persistedAttachment) => {
        //Could be succes as well as error
        //Handled within the interested component(attachments), by the ID presense/absence
        this.emitNewRecord([persistedAttachment]);
      }
    );
    return observable;
  }
}
