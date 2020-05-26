import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit, OnDestroy {
  unsubscribe = new Subject<void>();
  isWaiting = false;
  user: User;
  constructor(private snackBar: MatSnackBar, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.userChange.pipe(takeUntil(this.unsubscribe)).subscribe(user => {
      this.user = user;
    });
  }

  async sendEmailVerification() {
    try {
      this.isWaiting = true;
      await this.authService.sendEmailVerification();
    } catch (error) {
      this.snackBar.open(error.message, 'Ok', {
        duration: 10000
      });
    } finally {
      this.isWaiting = false;
    }
  }

  async logout() {
    try {
      this.isWaiting = true;
      await this.authService.logout();
    } catch (error) {
      this.snackBar.open(error.message, 'Ok', {
        duration: 10000
      });
    } finally {
      this.isWaiting = false;
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
