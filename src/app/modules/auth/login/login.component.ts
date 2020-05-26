import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isWaiting = false;
  constructor(private router: Router, private snackBar: MatSnackBar, private authService: AuthService) { }

  ngOnInit(): void {
  }

  async onSubmit(form: NgForm) {
    if (form.valid) {
      try {
        this.isWaiting = true;
        await this.authService.login(form.value.email, form.value.password);
      } catch (error) {
        console.log(error);
        this.isWaiting = false;
        this.snackBar.open(error.message, 'Ok', {
          duration: 10000
        });
      }
    }
  }

  navigate() {
    this.router.navigate(['/auth/signup']);
  }

}
