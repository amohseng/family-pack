import { Component, OnInit, OnDestroy, Input, EventEmitter, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss']
})
export class SidenavListComponent implements OnInit, OnDestroy {
  @Input() sidenav;
  @Output() themeChanged: EventEmitter<void> = new EventEmitter<void>();
  unsubscribe = new Subject<void>();
  authenticated = false;
  user: User;
  constructor(private snackBar: MatSnackBar, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.authChange.pipe(takeUntil(this.unsubscribe)).subscribe(authenticated => {
      this.authenticated = authenticated;
    });
    this.authService.userChange.pipe(takeUntil(this.unsubscribe)).subscribe(user => {
      this.user = user;
    });
  }

  changeTheme() {
    this.themeChanged.emit();
    this.sidenav.toggle();
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
