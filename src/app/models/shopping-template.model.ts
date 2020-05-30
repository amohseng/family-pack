export interface ShoppingItem {
  id: string;
  name: string;
}

export interface ShoppingCategory {
  id: string;
  name: string;
  items: ShoppingItem[];
}

export interface ShoppingTemplate {
  id: string;
  categories: ShoppingCategory[];
}
