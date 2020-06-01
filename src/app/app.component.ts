import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { fadeInAnimation } from './animations';
import { AuthService } from './services/auth.service';
import { IconService } from './services/icon.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    fadeInAnimation
  ]
})
export class AppComponent {

  constructor(private authService: AuthService, private iconService: IconService) {
    if (!localStorage.getItem('theme')) {
      localStorage.setItem('theme', 'app-light-theme');
    }
    document.getElementsByTagName('html')[0].classList.add(localStorage.getItem('theme'));
    this.authService.initAuthListener();
  }

  // detect when a view changes
  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData; // && outlet.activatedRouteData['animation'];
  }
}
