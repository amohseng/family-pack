import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class IconService {
  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'outline-settings',
      sanitizer.bypassSecurityTrustResourceUrl(
        'assets/img/icons/outline-settings-24px.svg'
      )
    );
    iconRegistry.addSvgIcon(
      'outline-camera_alt',
      sanitizer.bypassSecurityTrustResourceUrl(
        'assets/img/icons/outline-camera_alt-24px.svg'
      )
    );
    iconRegistry.addSvgIcon(
      'outline-edit',
      sanitizer.bypassSecurityTrustResourceUrl(
        'assets/img/icons/outline-edit-24px.svg'
      )
    );
    iconRegistry.addSvgIcon(
      'outline-save',
      sanitizer.bypassSecurityTrustResourceUrl(
        'assets/img/icons/outline-save-24px.svg'
      )
    );
    iconRegistry.addSvgIcon(
      'outline-check_box',
      sanitizer.bypassSecurityTrustResourceUrl(
        'assets/img/icons/outline-check_box-24px.svg'
      )
    );
    iconRegistry.addSvgIcon(
      'outline-local_offer',
      sanitizer.bypassSecurityTrustResourceUrl(
        'assets/img/icons/outline-local_offer-24px.svg'
      )
    );
    iconRegistry.addSvgIcon(
      'outline-shopping_cart',
      sanitizer.bypassSecurityTrustResourceUrl(
        'assets/img/icons/outline-shopping_cart-24px.svg'
      )
    );
    iconRegistry.addSvgIcon(
      'outline-remove_shopping_cart',
      sanitizer.bypassSecurityTrustResourceUrl(
        'assets/img/icons/outline-remove_shopping_cart-24px.svg'
      )
    );
  }
}
