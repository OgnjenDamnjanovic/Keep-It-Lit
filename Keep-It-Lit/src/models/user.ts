import { Inventory } from "./inventory";
import { SavedGame } from "./savedGame";

export interface User {
  id:number,
  username: string;
  password: string;
  gameInfo: SavedGame;
  inventory: Inventory;
  balance:number;
}
