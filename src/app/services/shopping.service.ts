import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';

import { ShoppingTemplate } from '../models/shopping-template.model';
import { defaultShoppingTemplate } from '../../assets/data/default-shopping-template';

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
      take(1),
      map(data => {
        if (data) {
          const id = shoppingTemplateId;
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
}
