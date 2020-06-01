import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgModel } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { User } from 'src/app/models/user.model';
import { ShoppingTemplate } from 'src/app/models/shopping-template.model';
import { AuthService } from 'src/app/services/auth.service';
import { ShoppingService } from 'src/app/services/shopping.service';
import { ShoppingListItem } from 'src/app/models/shopping-list-item.model';
import { ArchivedShoppingList } from 'src/app/models/archived-shopping-list.model';
import { ShoppingConfirmComponent } from '../shopping-confirm/shopping-confirm.component';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  unsubscribe = new Subject<void>();
  isWaiting = false;
  isWriting = false;
  user: User;
  shoppingTemplate: ShoppingTemplate;
  shoppingListItems: ShoppingListItem[];
  archivedShoppingList: ArchivedShoppingList;

  viewMode = 'edit';
  expandedMode = null;
  constructor(private router: Router, private snackBar: MatSnackBar, public dialog: MatDialog,
              private authService: AuthService, private shoppingService: ShoppingService) { }

  ngOnInit(): void {
    this.authService.userChange.pipe(takeUntil(this.unsubscribe)).subscribe(user => {
      this.user = user;
      if (user && user.groupId) {
        this.getShoppingTemplate();
      } else {
        this.router.navigate(['/auth/joingroup']);
      }
    });
  }

  getShoppingTemplate() {
    this.isWaiting = true;
    this.shoppingService.getShoppingTemplate(this.user.groupId).pipe(takeUntil(this.unsubscribe)).subscribe(shoppingTemplate => {
      if (shoppingTemplate) {
        this.shoppingTemplate = shoppingTemplate;
        this.getShoppingListItems();
      }
    },
    error => {
      console.log(error);
      this.snackBar.open(error.message, 'Ok', {
        duration: 10000
      });
    });
  }

  getShoppingListItems() {
    this.shoppingService.getShoppingListItems(this.user.groupId).pipe(takeUntil(this.unsubscribe)).subscribe(shoppingListItems => {
      this.shoppingListItems = shoppingListItems;
      this.isWaiting = false;
    },
    error => {
      console.log(error);
      this.snackBar.open(error.message, 'Ok', {
        duration: 10000
      });
    });
  }

  async createShoppingListItem(id: string, name: string, categoryId: string, categoryName: string, itemInput: NgModel) {
    try {
      if (itemInput.valid) {
        await this.shoppingService
        .saveShoppingListItem({
          id,
          name,
          categoryId,
          categoryName,
          groupId: this.user.groupId,
          quantity: +itemInput.value,
          purchased: false
        });
      } else {
        itemInput.reset();
      }
    } catch (error) {
      console.log(error);
      this.snackBar.open(error.message, 'Ok', {
        duration: 10000
      });
    }
  }

  async deleteShoppingListItem(id: string, itemInput: NgModel) {
    try {
      await this.shoppingService.deleteShoppingListItem(id);
      itemInput.reset();
    } catch (error) {
      console.log(error);
      this.snackBar.open(error.message, 'Ok', {
        duration: 10000
      });
    }
  }

  async toggleItemPurchaseStatus(shoppingListItem: ShoppingListItem) {
    try {
      shoppingListItem.purchased = !shoppingListItem.purchased;
      await this.shoppingService.saveShoppingListItem(shoppingListItem);
    } catch (error) {
      console.log(error);
      this.snackBar.open(error.message, 'Ok', {
        duration: 10000
      });
    }
  }

  confirm() {
    const dialogRef = this.dialog.open(ShoppingConfirmComponent, {
      width: '300px',
      data: {shoppingListItemsCount: this.shoppingListItems.length, purchasedItemsCount: this.getPurchasedItemsCount()}
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.done();
      }
    });
  }

  async done() {
    try {
      this.isWriting = true;
      this.archivedShoppingList = {
        id: this.shoppingService.getDBId(),
        groupId: this.user.groupId,
        items: this.shoppingListItems.filter(item => item.purchased),
        shoppingDate: new Date()
      };
      for (const item of this.archivedShoppingList.items) {
        await this.shoppingService.deleteShoppingListItem(item.id);
      }
      await this.shoppingService.saveArchivedShoppingList(this.archivedShoppingList);
      this.snackBar.open('Your purchased items saved to history folder successfully', 'Ok', {
        duration: 10000
      });
      this.expandedMode = null;
      this.viewMode = 'edit';
    } catch (error) {
      console.log(error);
      this.snackBar.open(error.message, 'Ok', {
        duration: 10000
      });
    } finally {
      this.isWriting = false;
    }
  }

  inShoppingList(id: string): boolean {
    return !!this.shoppingListItems.find(item => item.id === id);
  }

  getQuantity(id: string): number | null {
    const found = this.shoppingListItems.find(item => item.id === id);
    if (found) {
      return found.quantity;
    }
    return null;
  }

  getSelectedItemsCount(categoryId: string) {
    return this.shoppingListItems.filter(item => item.categoryId === categoryId).length;
  }

  getPurchasedItemsCount() {
    return this.shoppingListItems.filter(item => item.purchased).length;
  }


  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
