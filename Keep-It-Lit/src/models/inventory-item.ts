export interface InventoryItem<T>{
    item: T;
    quantity:number;
    
}
export function areSameInventoryItems<T>(
    item1: InventoryItem<T>,
    item2: InventoryItem<T>
  ): boolean {
    return item1.quantity === item2.quantity && item1.item === item2.item;
  }