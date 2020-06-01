export interface ShoppingListItem {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  groupId: string;
  quantity: number;
  purchased: boolean;
}
