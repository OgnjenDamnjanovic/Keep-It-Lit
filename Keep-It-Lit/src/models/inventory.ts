import { Dictionary } from "../misc/Dictionary";
import { FirestarterItem } from "./firestarter-item";
import { FirewoodItem } from "./firewood-item";
import { FlammableItem } from "./flammable-item";
import { InventoryItem } from "./inventory-item";

export class Inventory {
  flammableItems: Dictionary<InventoryItem<FlammableItem>> = {};
  firewoodItems: Dictionary<InventoryItem<FirewoodItem>> = {};
  firestarterItems: Dictionary<InventoryItem<FirestarterItem>> = {};
  constructor(
    flammableItems: Array<InventoryItem<FlammableItem>>,
    firewoodItems: Array<InventoryItem<FirewoodItem>>,
    firestarterItems: Array<InventoryItem<FirestarterItem>>
  ) {
    flammableItems.map((item) => (this.flammableItems[item.item.name] = item));
    firewoodItems.map((item) => (this.firewoodItems[item.item.name] = item));
    firestarterItems.map((item) => (this.firestarterItems[item.item.name] = item));
  }
}
