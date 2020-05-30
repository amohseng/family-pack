import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() sidenav;
  unsubscribe = new Subject<void>();
  authenticated = false;
  user: User;
  toolbarColor;
  constructor(private snackBar: MatSnackBar, private authService: AuthService) { }

  ngOnInit(): void {
    const theme = localStorage.getItem('theme');
    this.authService.authChange.pipe(takeUntil(this.unsubscribe)).subscribe(authenticated => {
      this.authenticated = authenticated;
    });
    this.authService.userChange.pipe(takeUntil(this.unsubscribe)).subscribe(user => {
      this.user = user;
    });
  }

  changeTheme() {
    const theme = localStorage.getItem('theme');
    theme === 'app-light-theme' ? localStorage.setItem('theme', 'app-dark-theme') : localStorage.setItem('theme', 'app-light-theme');
    document.getElementsByTagName('html')[0].classList.remove(theme);
    document.getElementsByTagName('html')[0].classList.add(localStorage.getItem('theme'));
  }

  async logout() {
    try {
      await this.authService.logout();
    } catch (error) {
      this.snackBar.open(error.message, 'Ok', {
        duration: 10000
      });
    } finally {
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
