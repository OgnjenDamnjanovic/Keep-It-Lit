import { INITIAL_BALANCE } from "../../misc/GameConfig";
import { Inventory } from "../inventory";
import { SavedGame } from "../savedGame";
import { User } from "../user";
import { InventoryDTO, InventoryToInventoryDTO } from "./inventory-dto";
import { Guid } from "guid-typescript";
export interface UserDTO {
  id:string,
  username: string;
  password: string;
  gameInfo: SavedGame;
  balance: number;
  inventory: InventoryDTO;
}
export function userDTOtoUser(userDTO: UserDTO, inventory: Inventory): User {
  return {
    id:userDTO.id,
    username: userDTO.username,
    password: userDTO.password,
    gameInfo: userDTO.gameInfo,
    inventory: inventory,
    balance: userDTO.balance,
  };
}

export function createInitialUserDTO(username:string,password:string):UserDTO{
  return {
    id:Guid.create().toString(),
    username:username,
    password:password,
    gameInfo:null,
    balance:INITIAL_BALANCE,
    inventory:{
      firewoodItems:[],
      flammableItems:[],
      firestarterItems:[]
    }
  }
}
export function userToUserDTO(user:User):UserDTO{

  return {
    id:user.id,
    balance:user.balance,
    password:user.password,
    username:user.username,
    gameInfo:user.gameInfo,
    inventory:InventoryToInventoryDTO(user.inventory)
  }
}