import { Directive, ElementRef, Renderer2, HostListener, Input, AfterViewInit  } from '@angular/core';

import { AttachmentDao } from '../dao';

//Handles the drag-and-drop based upload
@Directive({
  selector: '[appDroppable]'
})
export class DroppableDirective implements AfterViewInit {

  @Input('appDroppable') locationId: string;

  constructor(private el: ElementRef,
              private renderer: Renderer2,
              private attachmentDao: AttachmentDao) { }

  ngAfterViewInit() {
    this.renderer.addClass(this.el.nativeElement, 'droppableInactive');
  }

  //UI highlightning upon hovering
  @HostListener('dragenter', ['$event']) onDragEnter(event) {
    this.renderer.addClass(this.el.nativeElement, 'droppableHighlight');
  }

  @HostListener('dragleave', ['$event']) onDragLeave(event) {
    this.renderer.removeClass(this.el.nativeElement, 'droppableHighlight');
  }

  @HostListener('dragover', ['$event']) onDragOver(event) {
    return false;
  }

  //Reads/uploads the attachment via the service
  @HostListener('drop', ['$event']) onDrop(event) {
    let files = this.handleDropEvent(event);
    if (files && files.length) {
      this.attachmentDao.insert(files, this.locationId);
    }
    return false;
  }

  private handleDropEvent(event) 
	{
    let files = [];
		if (this.containsFiles(event))
		{
      this.renderer.removeClass(this.el.nativeElement, 'droppableHighlight');
			files = event.dataTransfer.files;
    }
    return files;
	}

	private containsFiles(event) 
	{
		if (event.dataTransfer.types) 
		{
			for (let i = 0; i < event.dataTransfer.types.length; i++) 
			{
				if (event.dataTransfer.types[i] == "Files") 
				{
					return true;
				}
			}
		}
		
		return false;
	}
}
