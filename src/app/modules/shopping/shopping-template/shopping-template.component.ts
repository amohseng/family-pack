import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.model';
import { ShoppingService } from 'src/app/services/shopping.service';
import { ShoppingTemplate } from 'src/app/models/shopping-template.model';
import { FormControl, NgModel, NgForm } from '@angular/forms';

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
    this.shoppingService.getShoppingTemplate(this.user.groupId).subscribe(shoppingTemplate => {
      if (shoppingTemplate) {
        this.shoppingTemplate = shoppingTemplate;
      } else {
        this.setNewShoppingTemplate();
      }
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

  async saveShoppingTemplate() {
    try {
      this.isWaiting = true;
      await this.shoppingService.saveShoppingTemplate(this.shoppingTemplate);
      this.snackBar.open('Shopping template saved successfully', 'Ok', {
        duration: 10000
      });
    } catch (error) {
      console.log(error);
      this.snackBar.open(error.message, 'Ok', {
        duration: 10000
      });
    } finally {
      this.isWaiting = false;
    }
  }

  addCategory(newCategoryInput: NgModel) {
    if (newCategoryInput.valid) {
      this.shoppingTemplate.categories.push({
        id: this.shoppingService.getDBId(),
        name: newCategoryInput.value,
        items: []
      });
    }
    newCategoryInput.reset();
  }

  updateCategory(categoryId: string, categoryInput: NgModel) {
    if (categoryInput.valid) {
      const index = this.shoppingTemplate.categories.findIndex((category) => {
        return category.id === categoryId;
      });
      if (index >= 0) {
        this.shoppingTemplate.categories[index].name = categoryInput.value;
      }
    }
    this.editMode = null;
  }

  deleteCategory(categoryId: string) {
    const index = this.shoppingTemplate.categories.findIndex((category) => {
      return category.id === categoryId;
    });
    if (index >= 0) {
      this.shoppingTemplate.categories.splice(index, 1);
    }
  }

  addItem(categoryId: string, newItemInput: NgModel) {
    if (newItemInput.valid) {
      const index = this.shoppingTemplate.categories.findIndex((category) => {
        return category.id === categoryId;
      });
      if (index > -1) {
        this.shoppingTemplate.categories[index].items.push({
          id: this.shoppingService.getDBId(),
          name: newItemInput.value
        });
      }
    }
    newItemInput.reset();
  }

  updateItem(categoryId: string, itemId: string, itemInput: NgModel) {
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
        }
      }
    }
    this.editMode = null;
  }

  deleteItem(categoryId: string, itemId: string) {
    const categoryIndex = this.shoppingTemplate.categories.findIndex((category) => {
      return category.id === categoryId;
    });
    if (categoryIndex > -1) {
      const itemIndex = this.shoppingTemplate.categories[categoryIndex].items.findIndex((item) => {
        return item.id === itemId;
      });
      if (itemIndex > -1) {
        this.shoppingTemplate.categories[categoryIndex].items.splice(itemIndex, 1);
      }
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }



}
