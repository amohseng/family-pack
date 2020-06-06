import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Meta } from '@angular/platform-browser';

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
  toolbarColor = '';
  constructor(private meta: Meta, private authService: AuthService, private iconService: IconService) {
    this.setTheme();
    this.authService.initAuthListener();
  }

  // detect when a view changes
  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData; // && outlet.activatedRouteData['animation'];
  }

  setTheme() {
    if (!localStorage.getItem('theme')) {
      localStorage.setItem('theme', 'app-light-theme');
      this.toolbarColor = 'primary';
    } else {
      localStorage.getItem('theme') === 'app-light-theme' ? this.toolbarColor = 'primary': this.toolbarColor = '';
      localStorage.getItem('theme') === 'app-light-theme' ? this.meta.updateTag({ name: 'theme-color', content: '#5C6BC0' }) : this.meta.updateTag({ name: 'theme-color', content: '#424242' });
    }
    document.getElementsByTagName('html')[0].classList.add(localStorage.getItem('theme'));
  }

  changeTheme() {
    const oldtheme = localStorage.getItem('theme');
    oldtheme === 'app-light-theme' ? localStorage.setItem('theme', 'app-dark-theme') : localStorage.setItem('theme', 'app-light-theme');
    localStorage.getItem('theme') === 'app-light-theme' ? this.toolbarColor = 'primary': this.toolbarColor = '';
    localStorage.getItem('theme') === 'app-light-theme' ? this.meta.updateTag({ name: 'theme-color', content: '#5C6BC0' }) : this.meta.updateTag({ name: 'theme-color', content: '#424242' });
    document.getElementsByTagName('html')[0].classList.remove(oldtheme);
    document.getElementsByTagName('html')[0].classList.add(localStorage.getItem('theme'));
  }
}
