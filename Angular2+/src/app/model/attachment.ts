import { 
	genericError, 
	baseURL 
} from '../constants';

export class Attachment
{
	static counter = 0;

	file: File;
	attachment;
    isSelected: boolean = false;
	isProcessing: boolean = false;
	errorTakesPlace: boolean = false;
	errorMessage: string = genericError;
	downloadUrl: string = baseURL.replace(/\.com\/.*/, '.com/servlet/servlet.FileDownload?file=');

	constructor(file?: File, parentId?: string)
	{
		if (file) {
			this.file = file;
			this.isProcessing = true;
			this.attachment = {
				Description: (Attachment.counter++) + '',
				ParentId: parentId,
				Name: file.name,
				IsPrivate: false,
				ContentType: file.type
			};
		}
	}
}