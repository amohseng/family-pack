import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';

import { ShoppingTemplate } from '../models/shopping-template.model';
import { defaultShoppingTemplate } from '../../assets/data/default-shopping-template';
import { ShoppingListItem } from '../models/shopping-list-item.model';
import { ArchivedShoppingList } from '../models/archived-shopping-list.model';

@Injectable({
  providedIn: 'root'
})
export class ShoppingService {

  constructor(private db: AngularFirestore) { }

  getDBId() {
    return this.db.createId();
  }

  initShoppingTemplate(groupId: string): ShoppingTemplate {
    const template: ShoppingTemplate = defaultShoppingTemplate;
    template.id = groupId;
    template.categories.forEach(category => {
      category.id = this.getDBId();
      category.items.forEach(item => {
        item.id = this.getDBId();
      });
    });
    return template;
  }

  getShoppingTemplate(shoppingTemplateId: string): Observable<ShoppingTemplate> {
    return this.db.doc<ShoppingTemplate>(`shoppingTemplates/${shoppingTemplateId}`).valueChanges()
      .pipe(
        map(data => {
          if (data) {
            const id = shoppingTemplateId;
            data.categories.sort(this.orderByName);
            data.categories.forEach(category => {
              category.items.sort(this.orderByName);
            });
            return { ...data, id };
          } else {
            return null;
          }
        })
      );
  }

  async saveShoppingTemplate(shoppingTemplate: ShoppingTemplate): Promise<string> {
    try {
      await this.db.collection('shoppingTemplates').doc(shoppingTemplate.id).set(shoppingTemplate);
      return shoppingTemplate.id;
    } catch (error) {
      console.log(error);
      throw new Error('Failed to update shopping template data.');
    }
  }

  async saveArchivedShoppingList(archivedShoppingList: ArchivedShoppingList): Promise<string> {
    try {
      await this.db.collection('archivedShoppingLists').doc(archivedShoppingList.id).set(archivedShoppingList);
      return archivedShoppingList.id;
    } catch (error) {
      console.log(error);
      throw new Error('Failed to archive shopping list data.');
    }
  }

  getShoppingListItems(groupId: string) {
    return this.db.collection('shoppingListItems', ref => ref.where('groupId', '==', groupId))
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(action => {
            const data = action.payload.doc.data() as ShoppingListItem;
            const id = action.payload.doc.id;
            return { ...data, id };
          }).sort(this.orderByCategoryNameThenName)
        )
      );
  }

  async saveShoppingListItem(shoppingListItem: ShoppingListItem): Promise<string> {
    try {
      await this.db.collection('shoppingListItems').doc(shoppingListItem.id).set(shoppingListItem);
      return shoppingListItem.id;
    } catch (error) {
      console.log(error);
      throw new Error('Failed to update shopping list item data.');
    }
  }

  async deleteShoppingListItem(id: string): Promise<boolean> {
    try {
      await this.db.collection('shoppingListItems').doc(id).delete();
      return true;
    }
    catch (error) {
      console.log(error);
      throw new Error('Failed to delete shopping list item data.');
    }
  }


  orderByCategoryNameThenName(a, b) {
    const categoryNameA = a.categoryName.toUpperCase(); // ignore upper and lowercase
    const categoryNameB = b.categoryName.toUpperCase(); // ignore upper and lowercase
    const nameA = a.name.toUpperCase(); // ignore upper and lowercase
    const nameB = b.name.toUpperCase(); // ignore upper and lowercase
    if (categoryNameA < categoryNameB) {
      return -1;
    }
    if (categoryNameA > categoryNameB) {
      return 1;
    } else {
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
    }

    return 0;
  }

  orderByName(a, b) {
    const nameA = a.name.toUpperCase(); // ignore upper and lowercase
    const nameB = b.name.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  }
}
