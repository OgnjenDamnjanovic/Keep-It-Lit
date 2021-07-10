import { INITIAL_BALANCE } from "../../misc/GameConfig";
import { Inventory } from "../inventory";
import { User } from "../user";
import { InventoryDTO, InventoryToInventoryDTO } from "./inventory-dto";
import { Guid } from "guid-typescript";
import { Fireplace } from "../fireplace";
export interface UserDTO {
  id: string;
  username: string;
  password: string;
  gameInfo: Fireplace;
  balance: number;
  inventory: InventoryDTO;
}
export function userDTOtoUser(userDTO: UserDTO, inventory: Inventory): User {
  return {
    id: userDTO.id,
    username: userDTO.username,
    password: userDTO.password,
    gameInfo: userDTO.gameInfo,
    inventory: inventory,
    balance: userDTO.balance,
  };
}

export function createInitialUserDTO(
  username: string,
  password: string
): UserDTO {
  return {
    id: Guid.create().toString(),
    username: username,
    password: password,
    gameInfo: {
      emberAmount: 0,
      flameBaseLevel: 0,
      fireboosters: {},
      totalFlameMultiplier: 1,
      totalFlameIncrement: 0,
      firewood: {},
    },
    balance: INITIAL_BALANCE,
    inventory: {
      firewoodItems: [],
      flammableItems: [],
      firestarterItems: [],
    },
  };
}
export function userToUserDTO(user: User): UserDTO {
  return {
    id: user.id,
    balance: user.balance,
    password: user.password,
    username: user.username,
    gameInfo: user.gameInfo,
    inventory: InventoryToInventoryDTO(user.inventory),
  };
}
