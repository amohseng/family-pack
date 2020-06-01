import { ShoppingListItem } from './shopping-list-item.model';

export interface ArchivedShoppingList {
  id: string;
  groupId: string;
  items: ShoppingListItem[];
  shoppingDate: Date;
}
