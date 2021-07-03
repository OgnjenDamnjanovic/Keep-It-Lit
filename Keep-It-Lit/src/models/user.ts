import { FirestarterItem } from "./firestarter-item";
import { FirewoodItem } from "./firewood-item";
import { FlammableItem } from "./flammable-item";
import { Inventory } from "./inventory";
import { InventoryItem } from "./inventory-item";
import { SavedGame } from "./savedGame";

export class User {
  id: string;
  username: string;
  password: string;
  gameInfo: SavedGame;
  inventory: Inventory;
  balance: number;
  
}

export function isUser(object: any) {
  if (
    "id" in object &&
    "username" in object &&
    "password" in object &&
    "gameInfo" in object &&
    "inventory" in object &&
    "balance" in object
  ) return true;
  return false;
}
export function buyFlammableItem(user:User, item:FlammableItem):User{
  user.balance-=item.price;
  if(!Object.getOwnPropertyNames(user.inventory.flammableItems).includes(item.name)){
    user.inventory.flammableItems[item.name]=new InventoryItem<FlammableItem>(item,0);
  }
  user.inventory.flammableItems[item.name].quantity++;
  return user;    
}
export function buyFirestarterItem(user:User, item:FirestarterItem):User{
  user.balance-=item.price;
  if(!Object.getOwnPropertyNames(user.inventory.firestarterItems).includes(item.name)){
    user.inventory.firestarterItems[item.name]=new InventoryItem<FirestarterItem>(item,0);
  }
  user.inventory.firestarterItems[item.name].quantity++;
  return user;    
}
export function buyFirewoodItem(user:User, item:FirewoodItem):User{
  user.balance-=item.price;
  if(!Object.getOwnPropertyNames(user.inventory.firewoodItems).includes(item.name)){
    user.inventory.firewoodItems[item.name]=new InventoryItem<FirewoodItem>(item,0);
  }
  user.inventory.firewoodItems[item.name].quantity++;
  return user;    
}
