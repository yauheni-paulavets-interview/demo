import { Component, OnInit, Output, Input } from '@angular/core';
import { Router } from '@angular/router';
import { opacity } from '../../animations/app.animations';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    opacity(500)
  ]
})
export class HeaderComponent implements OnInit {

  @Input() isMapView;

  constructor(private router: Router) {}

  @Output() triggerView() {
    this.router.navigate(['/' + (this.isMapView ? 'list' : 'map')]);
  }

  ngOnInit() {
  }

}
