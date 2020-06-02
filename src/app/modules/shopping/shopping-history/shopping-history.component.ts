import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { User } from 'src/app/models/user.model';
import { ArchivedShoppingList } from 'src/app/models/archived-shopping-list.model';
import { AuthService } from 'src/app/services/auth.service';
import { ShoppingService } from 'src/app/services/shopping.service';

@Component({
  selector: 'app-shopping-history',
  templateUrl: './shopping-history.component.html',
  styleUrls: ['./shopping-history.component.scss']
})
export class ShoppingHistoryComponent implements OnInit, OnDestroy {
  unsubscribe = new Subject<void>();
  isWaiting = false;
  user: User;
  archivedShoppingLists: ArchivedShoppingList[];
  expandedMode = null;
  constructor(private router: Router, private snackBar: MatSnackBar,
              private authService: AuthService, private shoppingService: ShoppingService) { }

  ngOnInit(): void {
    this.authService.userChange.pipe(takeUntil(this.unsubscribe)).subscribe(user => {
      this.user = user;
      if (user && user.groupId) {
        this.getArchivedShoppingLists();
      } else {
        this.router.navigate(['/auth/joingroup']);
      }
    });
  }

  getArchivedShoppingLists() {
    this.isWaiting = true;
    this.shoppingService.getArchivedShoppingLists(this.user.groupId).pipe(takeUntil(this.unsubscribe)).subscribe(archivedShoppingLists => {
      this.archivedShoppingLists = archivedShoppingLists;
      this.isWaiting = false;
    },
    error => {
      console.log(error);
      this.snackBar.open(error.message, 'Ok', {
        duration: 10000
      });
    });
  }


  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
