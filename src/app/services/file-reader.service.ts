import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Attachment } from '../model';

//Wraps the File API related logic
@Injectable()
export class FileReaderService {

	constructor() { }
	
	readeres: FileReader[] = [];

  readFiles(attachments, parentId): Observable<any>
	{
		return Observable.create((observer) => {
			for (let i = 0; i < attachments.length; i++)
			{
				this.buildObservable(attachments[i], parentId, observer);
			}
		});
	}

	private buildObservable(attachment: Attachment, parentId, observer)
	{
		let reader = new FileReader();
		this.readeres.push(reader);
		reader.onloadend = (event) => {
        	let target: any = event.target;
			let fileContent = this.getFileContent(target.result);
			attachment.attachment.Body = fileContent;
        	observer.next(attachment);
		}
		reader.readAsDataURL(attachment.file);
	}

	private getFileContent(fileData) 
	{
		let fileContent = String(fileData);
		return fileContent.substr(fileContent.indexOf(",") + 1);
	}
}
