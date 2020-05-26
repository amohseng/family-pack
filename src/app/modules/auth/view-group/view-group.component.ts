import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.model';
import { Group } from 'src/app/models/group.model';


@Component({
  selector: 'app-view-group',
  templateUrl: './view-group.component.html',
  styleUrls: ['./view-group.component.scss']
})
export class ViewGroupComponent implements OnInit, OnDestroy {
  unsubscribe = new Subject<void>();
  isWaiting = false;
  isAdmin = false;
  editMode = false;
  inviteMode = false;
  user: User;
  members: User[];
  group: Group;
  pendingInvitations: string[] = [];
  constructor(private router: Router, private snackBar: MatSnackBar, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.userChange.pipe(takeUntil(this.unsubscribe)).subscribe(user => {
      this.user = user;
      if (user && user.groupId) {
        this.getGroup();
      } else {
        this.router.navigate(['/auth/joingroup']);
      }
    });
  }

  getGroup() {
    this.isWaiting = true;
    this.authService.getGroup(this.user.groupId).pipe(takeUntil(this.unsubscribe)).subscribe(group => {
      this.group = group;
      this.isAdmin = this.group.admin.id === this.user.id;
      this.getGroupMembers();
    }, error => {
      console.log(error);
      this.snackBar.open(error.message, 'Ok', {
        duration: 10000
      });
    });
  }

  getGroupMembers() {
    this.authService.getUsersByGroupId(this.user.groupId).pipe(takeUntil(this.unsubscribe)).subscribe(users => {
      this.members = users;
      this.setPendingInvitations();
      this.isWaiting = false;
    }, error => {
      console.log(error);
      this.snackBar.open(error.message, 'Ok', {
        duration: 10000
      });
    });
  }

  async leaveGroup() {
    try {
      this.isWaiting = true;
      this.user.groupId = null;
      await this.authService.updateUser(this.user);
      this.router.navigate(['/auth/joingroup']);
    } catch (error) {
      console.log(error);
      this.snackBar.open(error.message, 'Ok', {
        duration: 10000
      });
    } finally {
      this.isWaiting = false;
    }
  }

  async createInvitation(email: string) {
    try {
      this.isWaiting = true;
      if (this.group.invitations.indexOf(email.toLowerCase()) === -1) {
        this.group.invitations.push(email.toLowerCase());
        await this.authService.updateGroup(this.group);
        this.setPendingInvitations();
        this.inviteMode = false;
      }
    } catch (error) {
      console.log(error);
      this.snackBar.open(error.message, 'Ok', {
        duration: 10000
      });
    } finally {
      this.isWaiting = false;
    }
  }

  async removeInvitation(email: string) {
    try {
      this.isWaiting = true;
      const index = this.group.invitations.indexOf(email.toLowerCase());
      if (index > -1) {
        this.group.invitations.splice(index, 1);
        await this.authService.updateGroup(this.group);
        this.setPendingInvitations();
      }
    } catch (error) {
      console.log(error);
      this.snackBar.open(error.message, 'Ok', {
        duration: 10000
      });
    } finally {
      this.isWaiting = false;
    }
  }

  setPendingInvitations() {
    const familyEmails = this.members.map(member => member.email);
    this.pendingInvitations = this.group.invitations.filter(invitation => !familyEmails.includes(invitation));
  }

  async changeGroupName(name: string) {
    try {
      this.isWaiting = true;
      this.group.name = name;
      await this.authService.updateGroup(this.group);
      this.editMode = false;
    } catch (error) {
      console.log(error);
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
