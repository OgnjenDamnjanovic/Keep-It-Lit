import { getDictElements } from "../misc/Dictionary";
import { User } from "../models/user";

export function cloneUserDepth2(user: User): User {
    return {
      ...user,
      inventory: {
        flammableItems: { ...user.inventory.flammableItems },
        firewoodItems: { ...user.inventory.firewoodItems },
        firestarterItems: { ...user.inventory.firestarterItems },
      },
      gameInfo: {
        ...user.gameInfo,
        firewood: { ...user.gameInfo.firewood },
        fireboosters: { ...user.gameInfo.fireboosters },
      },
    };
  }
  export function cloneFirewoodComponents(src: User, dest: User): User {
    getDictElements(dest.gameInfo.firewood).forEach((prop) => {
      dest.gameInfo.firewood[prop] = {
        ...src.gameInfo.firewood[prop],
      };
    }); 
    return dest;
  }
  // export function cloneFirewoodItems(src: User, dest: User): User {
  //   getDictElements(dest.inventory.firewoodItems).forEach((x) => {
  //     dest.inventory.firewoodItems[x] = {
  //       ...src.inventory.firewoodItems[x],
  //     };
  //   });
  //   return dest;
  // }
  // export function cloneFlammableItems(src: User, dest: User): User {
  //   getDictElements(dest.inventory.flammableItems).forEach((x) => {
  //     dest.inventory.flammableItems[x] = {
  //       ...src.inventory.flammableItems[x],
  //     };
  //   });
  //   return dest;
  // }
  
  // export function cloneFirestarterItems(src: User, dest: User): User {
  //   getDictElements(dest.inventory.firestarterItems).forEach((x) => {
  //     dest.inventory.firestarterItems[x] = {
  //       ...src.inventory.firestarterItems[x],
  //     };
  //   });
  //   return dest;
  // }