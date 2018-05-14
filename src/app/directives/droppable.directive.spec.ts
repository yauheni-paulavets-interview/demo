import { DroppableDirective } from './droppable.directive';
import { Directive, ElementRef, Renderer2, HostListener  } from '@angular/core';
import { AttachmentDao } from '../dao';

describe('HighlightDirective', () => {
  it('should create an instance', () => {
    let el: ElementRef;
    let renderer: Renderer2;
    let attachmentDao: AttachmentDao;
    const directive = new DroppableDirective(el, renderer, attachmentDao);
    expect(directive).toBeTruthy();
  });
});
