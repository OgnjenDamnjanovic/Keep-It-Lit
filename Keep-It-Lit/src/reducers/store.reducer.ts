import { Dictionary, getDictElements } from "../misc/Dictionary";
import { FirestarterItem } from "../models/firestarter-item";
import { FirewoodItem } from "../models/firewood-item";
import { FlammableItem } from "../models/flammable-item";
import { InventoryItem } from "../models/inventory-item";
import { User } from "../models/user";
import { cloneUserDepth2 } from "./common";

export function buyFlammableItem(user: User, item: FlammableItem): User {
  const newUser: User = cloneUserDepth2(user);

  return buyItem(newUser, item, newUser.inventory.flammableItems);
}
export function buyFirestarterItem(user: User, item: FirestarterItem): User {
  const newUser: User = cloneUserDepth2(user);

  return buyItem(newUser, item, newUser.inventory.firestarterItems);
}
export function buyFirewoodItem(user: User, item: FirewoodItem): User {
  const newUser: User = cloneUserDepth2(user);

  return buyItem(newUser, item, newUser.inventory.firewoodItems);
}
export function buyItem(
  user: User,
  item: FlammableItem | FirestarterItem | FirewoodItem,
  itemsDict: Dictionary<
    InventoryItem<FlammableItem | FirewoodItem | FirestarterItem>
  >
):User {
  user.balance -= item.price;
  if (!itemsDict[item.name]) {
    itemsDict[item.name] = {
      item: item,
      quantity: 0,
    };
  } else itemsDict[item.name] = { ...itemsDict[item.name] };
  itemsDict[item.name].quantity++;
  return Object.freeze(user);
}
