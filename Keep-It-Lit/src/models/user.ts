
import { Fireplace } from "./fireplace";

import { Inventory } from "./inventory";

export interface User {
  id: string;
  username: string;
  password: string;
  gameInfo: Fireplace;
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
  )
    return true;
  return false;
}