import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { auth } from 'firebase/app';

import { BehaviorSubject, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';


import { User } from '../models/user.model';
import { Group } from '../models/group.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authChange: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  userChange: BehaviorSubject<User> = new BehaviorSubject<User>(null);

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore, private router: Router) {}

  initAuthListener() {
    this.afAuth.authState.subscribe(currentUser => {
      if (currentUser && currentUser.emailVerified) {
        this.getUser(currentUser.uid).subscribe(user => {
          if (user) {
            this.authChange.next(true);
            this.userChange.next(user);
            user.groupId ? this.router.navigate(['/']) : this.router.navigate(['/auth/joingroup']);
          }
        }, error => {
          console.log(error);
        });
      } else if (currentUser && !currentUser.emailVerified) {
        this.authChange.next(false);
        this.userChange.next({
          id: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.email,
          photoURL: 'assets/img/profile/anonymous.png',
          groupId: null
        });
        this.router.navigate(['/auth/verify']);
      } else {
        this.authChange.next(false);
        this.userChange.next(null);
        this.router.navigate(['/auth/login']);
      }
    });
  }

  async signup(email: string, password: string) {
    try {
      await this.afAuth.createUserWithEmailAndPassword(email, password);
      await this.createUser();
      await this.sendEmailVerification();
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  }

  async login(email: string, password: string) {
    try {
      await this.afAuth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  }

  async logout() {
    try {
      await this.afAuth.signOut();
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  }

  async sendEmailVerification() {
    try {
      const currentUser = await this.afAuth.currentUser;
      await currentUser.sendEmailVerification();
    } catch (error) {
      console.log(error);
      throw new Error('Failed to send verification email.');
    }
  }

  async changePassword(oldPassword: string, newPassword: string) {
    try {
      const currentUser = await this.afAuth.currentUser;
      const credential = auth.EmailAuthProvider.credential(currentUser.email, oldPassword);
      await currentUser.reauthenticateWithCredential(credential);
      await currentUser.updatePassword(newPassword);
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  }

  async createUser(): Promise<string> {
    try {
      const currentUser = await this.afAuth.currentUser;
      const user: User = {
        id: currentUser.uid,
        email: currentUser.email,
        displayName: currentUser.email,
        photoURL: 'assets/img/profile/anonymous.png',
        groupId: null
      };
      await this.db.collection('users').doc(user.id).set(user);
      return user.id;
    } catch (error) {
      console.log(error);
      throw new Error('Failed to create a new user.');
    }
  }

  async updateUser(user: User): Promise<string> {
    try {
      await this.db.collection('users').doc(user.id).set(user);
      return user.id;
    } catch (error) {
      console.log(error);
      throw new Error('Failed to update user data.');
    }
  }

  getUser(userId: string): Observable<User> {
    return this.db.doc<User>(`users/${userId}`).valueChanges()
    .pipe(
      take(1),
      map(data => {
        if (data) {
          const id = userId;
          return { ...data, id };
        } else {
          return null;
        }
      })
    );
  }

  getUsersByGroupId(groupId: string) {
    return this.db.collection('users', ref => ref.where('groupId', '==', groupId))
      .snapshotChanges()
      .pipe(
        take(1),
        map(actions => actions.map(action => {
            const data = action.payload.doc.data() as User;
            const id = action.payload.doc.id;
            return { ...data, id };
          })
        )
      );
  }

  async createGroup(group: Group): Promise<string> {
    try {
      group.id = this.db.createId();
      group.admin.groupId = group.id;
      await this.db.collection('groups').doc(group.id).set(group);
      return group.id;
    } catch (error) {
      console.log(error);
      throw new Error('Failed to update group data.');
    }
  }

  async updateGroup(group: Group): Promise<string> {
    try {
      await this.db.collection('groups').doc(group.id).set(group);
      return group.id;
    } catch (error) {
      console.log(error);
      throw new Error('Failed to update group data.');
    }
  }

  getGroup(groupId: string): Observable<Group> {
    return this.db.doc<Group>(`groups/${groupId}`).valueChanges()
    .pipe(
      take(1),
      map(data => {
        if (data) {
          const id = groupId;
          return { ...data, id };
        } else {
          return null;
        }
      })
    );
  }

  getGroupsByInvitation(invitation: string) {
    return this.db.collection('groups', ref => ref.where('invitations', 'array-contains', invitation))
      .snapshotChanges()
      .pipe(
        take(1),
        map(actions => actions.map(action => {
            const data = action.payload.doc.data() as Group;
            const id = action.payload.doc.id;
            return { ...data, id };
          }))
        );
  }

}
