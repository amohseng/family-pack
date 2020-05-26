import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class IconService {

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('outline-settings', sanitizer.bypassSecurityTrustResourceUrl('assets/img/icons/outline-settings-24px.svg'));
    iconRegistry.addSvgIcon('outline-camera_alt', sanitizer.bypassSecurityTrustResourceUrl('assets/img/icons/outline-camera_alt-24px.svg'));
  }
}
