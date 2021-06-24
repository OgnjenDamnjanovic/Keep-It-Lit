import { Inventory } from "../inventory";
import { SavedGame } from "../savedGame";
import { User } from "../user";
import { InventoryDTO } from "./inventory-dto";


export interface UserDTO{
    username:string;
    password:string;
    gameInfo:SavedGame;
    inventory:InventoryDTO
}
export function userDTOtoUser(userDTO: UserDTO, inventory: Inventory): User {
    return {
      username: userDTO.username,
      password: userDTO.password,
      gameInfo: userDTO.gameInfo,
      inventory: inventory,
    };
  }