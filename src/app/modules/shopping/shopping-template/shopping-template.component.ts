import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgModel } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AuthService } from 'src/app/services/auth.service';
import { ShoppingService } from 'src/app/services/shopping.service';
import { User } from 'src/app/models/user.model';
import { ShoppingTemplate } from 'src/app/models/shopping-template.model';
import { ShoppingListItem } from 'src/app/models/shopping-list-item.model';

@Component({
  selector: 'app-shopping-template',
  templateUrl: './shopping-template.component.html',
  styleUrls: ['./shopping-template.component.scss']
})
export class ShoppingTemplateComponent implements OnInit, OnDestroy {
  unsubscribe = new Subject<void>();
  isWaiting = false;
  user: User;
  shoppingTemplate: ShoppingTemplate;
  shoppingListItems: ShoppingListItem[];

  editMode = null;
  expandedMode = null;

  constructor(private router: Router, private snackBar: MatSnackBar,
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
      } else {
        this.setNewShoppingTemplate();
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

  setNewShoppingTemplate() {
    this.shoppingTemplate = {
      id: this.user.groupId,
      categories: []
    };
  }

  itemInShoppingList(id: string): boolean {
    return !!this.shoppingListItems.find(item => item.id === id);
  }

  categoryInShoppingList(categoryId: string): boolean {
    return !!this.shoppingListItems.find(item => item.categoryId === categoryId);
  }

  async saveShoppingTemplate() {
    try {
      await this.shoppingService.saveShoppingTemplate(this.shoppingTemplate);
    } catch (error) {
      console.log(error);
      this.snackBar.open(error.message, 'Ok', {
        duration: 10000
      });
    }
  }

  async addCategory(newCategoryInput: NgModel) {
    if (newCategoryInput.valid) {
      this.shoppingTemplate.categories.push({
        id: this.shoppingService.getDBId(),
        name: newCategoryInput.value,
        items: []
      });
      await this.saveShoppingTemplate();
    }
    newCategoryInput.reset();
  }

  async updateCategory(categoryId: string, categoryInput: NgModel) {
    if (categoryInput.valid) {
      const index = this.shoppingTemplate.categories.findIndex((category) => {
        return category.id === categoryId;
      });
      if (index >= 0) {
        this.shoppingTemplate.categories[index].name = categoryInput.value;
        await this.saveShoppingTemplate();
      }
    }
    this.editMode = null;
  }

  async deleteCategory(categoryId: string) {
    const index = this.shoppingTemplate.categories.findIndex((category) => {
      return category.id === categoryId;
    });
    if (index >= 0) {
      this.shoppingTemplate.categories.splice(index, 1);
      await this.saveShoppingTemplate();
    }
  }

  async addItem(categoryId: string, newItemInput: NgModel) {
    if (newItemInput.valid) {
      const index = this.shoppingTemplate.categories.findIndex((category) => {
        return category.id === categoryId;
      });
      if (index > -1) {
        this.shoppingTemplate.categories[index].items.push({
          id: this.shoppingService.getDBId(),
          name: newItemInput.value
        });
        await this.saveShoppingTemplate();
      }
    }
    newItemInput.reset();
  }

  async updateItem(categoryId: string, itemId: string, itemInput: NgModel) {
    if (itemInput.valid) {
      const categoryIndex = this.shoppingTemplate.categories.findIndex((category) => {
        return category.id === categoryId;
      });
      if (categoryIndex > -1) {
        const itemIndex = this.shoppingTemplate.categories[categoryIndex].items.findIndex((item) => {
          return item.id === itemId;
        });
        if (itemIndex > -1) {
          this.shoppingTemplate.categories[categoryIndex].items[itemIndex].name = itemInput.value;
          await this.saveShoppingTemplate();
        }
      }
    }
    this.editMode = null;
  }

  async deleteItem(categoryId: string, itemId: string) {
    const categoryIndex = this.shoppingTemplate.categories.findIndex((category) => {
      return category.id === categoryId;
    });
    if (categoryIndex > -1) {
      const itemIndex = this.shoppingTemplate.categories[categoryIndex].items.findIndex((item) => {
        return item.id === itemId;
      });
      if (itemIndex > -1) {
        this.shoppingTemplate.categories[categoryIndex].items.splice(itemIndex, 1);
        await this.saveShoppingTemplate();
      }
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }



}
