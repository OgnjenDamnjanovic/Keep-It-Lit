import { Dictionary, getDictElements, sameDictKeys } from "../misc/Dictionary";
import { FirestarterItem } from "./firestarter-item";
import { FirewoodItem } from "./firewood-item";
import { FlammableItem } from "./flammable-item";
import { InventoryItem } from "./inventory-item";

export interface Inventory {
  flammableItems: Dictionary<InventoryItem<FlammableItem>>;
  firewoodItems: Dictionary<InventoryItem<FirewoodItem>>;
  firestarterItems: Dictionary<InventoryItem<FirestarterItem>>;
}
export function createEmptyInventory():Inventory{
  return {
    firestarterItems: {},
    firewoodItems: {},
    flammableItems: {},
  };
}
export function createInventory(
  flammableItems: Array<InventoryItem<FlammableItem>>,
  firewoodItems: Array<InventoryItem<FirewoodItem>>,
  firestarterItems: Array<InventoryItem<FirestarterItem>>
) {
  const newInventory: Inventory = createEmptyInventory();
  flammableItems.map(
    (item) => (newInventory.flammableItems[item.item.name] = item)
  );
  firewoodItems.map(
    (item) => (newInventory.firewoodItems[item.item.name] = item)
  );
  firestarterItems.map(
    (item) => (newInventory.firestarterItems[item.item.name] = item)
  );
  return newInventory;
}

export function areSameInventories(invA: Inventory, invB: Inventory): boolean {
 
  if (
    !sameDictKeys(invA.firestarterItems, invB.firestarterItems) ||
    !sameDictKeys(invA.firewoodItems, invB.firewoodItems) ||
    !sameDictKeys(invA.flammableItems, invB.flammableItems)
  )
    return false;
  for (const key in invA.firestarterItems) {
    if (
      !areSameInventoryItems<FirestarterItem>(
        invA.firestarterItems[key],
        invB.firestarterItems[key]
      )
    )
      return false;
  }
  for (const key in invA.flammableItems) {
    if (
      !areSameInventoryItems<FlammableItem>(
        invA.flammableItems[key],
        invB.flammableItems[key]
      )
    )
      return false;
  }
  for (const key in invA.firewoodItems) {
    if (
      !areSameInventoryItems<FirewoodItem>(
        invA.firewoodItems[key],
        invB.firewoodItems[key]
      )
    )
      return false;
  }
  console.log("::true");
  return true;
}
export function areSameInventoryItems<T>(
  item1: InventoryItem<T>,
  item2: InventoryItem<T>
): boolean {
  return item1.quantity === item2.quantity && item1.item === item2.item;
}
