import { Inventory } from "./inventory";
import { SavedGame } from "./savedGame";

export interface User {
  username: string;
  password: string;
  gameInfo: SavedGame;
  inventory: Inventory;
}
