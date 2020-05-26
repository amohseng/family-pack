import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  unsubscribe = new Subject<void>();
  isWaiting = false;
  user: User;
  constructor(private snackBar: MatSnackBar, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.userChange.pipe(takeUntil(this.unsubscribe)).subscribe(user => {
      this.user = user;
    });
  }

  async onSubmit(form: NgForm) {
    if (form.valid) {
      try {
        this.isWaiting = true;
        await this.authService.changePassword(form.value.password, form.value.newPassword);
      } catch (error) {
        console.log(error);
        this.snackBar.open(error.message, 'Ok', {
          duration: 10000
        });
      } finally {
        this.isWaiting = false;
      }
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
