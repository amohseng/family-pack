import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Group } from 'src/app/models/group.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-join-group',
  templateUrl: './join-group.component.html',
  styleUrls: ['./join-group.component.scss']
})
export class JoinGroupComponent implements OnInit, OnDestroy {
  unsubscribe = new Subject<void>();
  isWaiting = false;
  user: User;
  groups: Group[] = [];
  constructor(private router: Router, private snackBar: MatSnackBar, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.userChange.pipe(takeUntil(this.unsubscribe)).subscribe(user => {
      this.user = user;
      if (user) {
        this.getGroups();
      }
    });
  }

  getGroups() {
    this.isWaiting = true;
    this.authService.getGroupsByInvitation(this.user.email).pipe(takeUntil(this.unsubscribe)).subscribe(groups => {
      this.groups = groups;
      this.isWaiting = false;
    }, error => {
      console.log(error);
      this.isWaiting = false;
      this.snackBar.open(error.message, 'Ok', {
        duration: 10000
      });
    });
  }

  async join(groupId: string) {
    try {
      this.isWaiting = true;
      this.user.groupId = groupId;
      await this.authService.updateUser(this.user);
      this.router.navigate(['/auth/viewgroup']);
    } catch (error) {
      this.snackBar.open(error.message, 'Ok', {
        duration: 10000
      });
    } finally {
      this.isWaiting = false;
    }
  }

  async createGroup(name: string) {
    try {
      this.isWaiting = true;
      const group: Group = {
        id: null,
        admin: this.user,
        name,
        invitations: []
      };
      const groupId = await this.authService.createGroup(group);
      this.user.groupId = groupId;
      await this.authService.updateUser(this.user);
      this.router.navigate(['/auth/viewgroup']);
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
