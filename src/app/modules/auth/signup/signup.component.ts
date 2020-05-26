import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  isWaiting = false;
  constructor(private snackBar: MatSnackBar, private authService: AuthService) { }

  ngOnInit(): void {
  }

  async onSubmit(form: NgForm) {
    if (form.valid) {
      try {
        this.isWaiting = true;
        await this.authService.signup(form.value.email, form.value.password);
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

}
