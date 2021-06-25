import { INITIAL_BALANCE } from "../../misc/GameConfig";
import { Inventory } from "../inventory";
import { SavedGame } from "../savedGame";
import { User } from "../user";
import { InventoryDTO } from "./inventory-dto";

export interface UserDTO {
  id:number,
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
    id:0,
    username:username,
    password:password,
    gameInfo:null,
    balance:INITIAL_BALANCE,
    inventory:{
      firewoodItems:[],
      flammableItems:[]
    }
  }
}