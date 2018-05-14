import { Component, OnInit, Input } from '@angular/core';
import { AttachmentDao } from '../../dao';

//Button/droppable section based files upload
//Responsible for the button based upload
//The drag-and-drop fells under the 'appDroppable' derictive responsibility.
@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {

  @Input() locationId: string;

  constructor(private attachmentDao: AttachmentDao) { }

  ngOnInit() {
  }

  //Uplaods the attachment via the service, which in it turns notifies intersted in components(attachments)
  onFileChange(event) {
    this.attachmentDao.insert(event.target.files, this.locationId);
  }
}
