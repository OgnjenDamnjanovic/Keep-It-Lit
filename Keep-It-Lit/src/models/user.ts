import { BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";
import { getDictElements } from "../misc/Dictionary";
import { FireBooster } from "./firebooster";
import { evaluateFireLevel, Fireplace } from "./fireplace";
import { FirestarterItem } from "./firestarter-item";
import { FirewoodItem } from "./firewood-item";
import { FlammableItem } from "./flammable-item";
import { Inventory } from "./inventory";

export interface User {
  id: string;
  username: string;
  password: string;
  gameInfo: Fireplace;
  inventory: Inventory;
  balance: number;
}

export function cloneUserDepth2(user: User): User {
  return {
    ...user,
    inventory: {
      flammableItems: { ...user.inventory.flammableItems },
      firewoodItems: { ...user.inventory.firewoodItems },
      firestarterItems: { ...user.inventory.firestarterItems },
    },
  };
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
export function buyFlammableItem(user: User, item: FlammableItem): User {
  const newUser: User = cloneFlammableItems(user, cloneUserDepth2(user));

  newUser.balance -= item.price;
  if (!getDictElements(newUser.inventory.flammableItems).includes(item.name)) {
    newUser.inventory.flammableItems[item.name] = {
      item: item,
      quantity: 0,
    };
  }
  newUser.inventory.flammableItems[item.name].quantity++;
  return newUser;
}
export function buyFirestarterItem(user: User, item: FirestarterItem): User {
  const newUser: User = cloneFirestarterItems(user, cloneUserDepth2(user));
  getDictElements(newUser.inventory.firestarterItems).forEach((x) => {
    newUser.inventory.firestarterItems[x] = {
      ...user.inventory.firestarterItems[x],
    };
  });
  newUser.balance -= item.price;
  if (
    !getDictElements(newUser.inventory.firestarterItems).includes(item.name)
  ) {
    newUser.inventory.firestarterItems[item.name] = {
      item: item,
      quantity: 0,
    };
  }
  newUser.inventory.firestarterItems[item.name].quantity++;
  return newUser;
}
export function buyFirewoodItem(user: User, item: FirewoodItem): User {
  const newUser: User = cloneFirewoodItems(user, cloneUserDepth2(user));
  getDictElements(newUser.inventory.firewoodItems).forEach((x) => {
    newUser.inventory.firewoodItems[x] = {
      ...user.inventory.firewoodItems[x],
    };
  });
  newUser.balance -= item.price;
  if (!getDictElements(newUser.inventory.firewoodItems).includes(item.name)) {
    newUser.inventory.firewoodItems[item.name] = {
      item: item,
      quantity: 0,
    };
  }
  newUser.inventory.firewoodItems[item.name].quantity++;

  return newUser;
}
export function insertFlammableItem(
  user: User,
  item: FlammableItem,
  userSubject: BehaviorSubject<User>
): User {
  if (!user.inventory.flammableItems[item.name]) return user;
  const newUser: User = cloneFlammableItems(user, cloneUserDepth2(user));
  newUser.inventory.flammableItems[item.name].quantity--;
  if (newUser.inventory.flammableItems[item.name].quantity === 0)
    delete newUser.inventory.flammableItems[item.name];
  if (evaluateFireLevel(newUser.gameInfo) != 0) {
    newUser.gameInfo.totalFlameMultiplier *= item.flameMultiplier;

    // const firebooster =
    //   user.gameInfo.fireboosters[
    //     user.gameInfo.fireboosters.push({
    //       timeLeft: item.flameMultiplierDuration,
    //       flameIncrement: 0,
    //       flameMultiplier: item.flameMultiplier,
    //     }) - 1
    //   ];

    // const fireBoosterFullTime = firebooster.timeLeft;
    // setTimeout(() => {
    //   clearInterval(intervalID);
    //   userSubject
    //     .pipe(map((user) => removeFireBooster(user, firebooster)))
    //     .subscribe(userSubject);
    // }, fireBoosterFullTime * 1000 + 1);

    // const intervalID = setInterval(() => {
    //   userSubject
    //     .pipe(map((user) => clockFireBooster(user, firebooster)))
    //     .subscribe(userSubject);
    // }, 1000);
  }

  return newUser;
}
export function insertFirestarterItem(
  user: User,
  item: FirestarterItem,
  userSubject: BehaviorSubject<User>
): User {
  if (!user.inventory.firestarterItems[item.name]) return user;
  const newUser: User = cloneFirestarterItems(user, cloneUserDepth2(user));
  newUser.inventory.firestarterItems[item.name].quantity--;
  if (newUser.inventory.firestarterItems[item.name].quantity === 0)
    delete newUser.inventory.firestarterItems[item.name];

  newUser.gameInfo.totalFlameIncrement += item.flameIncrement;
  if (item.firewoodContribution > 0) {
    if (!getDictElements(newUser.gameInfo.firewood).includes(item.name))
      newUser.gameInfo.firewood[item.name] = {
        combustionFactor: item.combustionFactor,
        totalFirewoodContribution: 0,
      };
    newUser.gameInfo.firewood[item.name].totalFirewoodContribution +=
      item.firewoodContribution;
  }

  // const firebooster =
  //   user.gameInfo.fireboosters[
  //     user.gameInfo.fireboosters.push({
  //       timeLeft: item.flameIncrementDuration,
  //       flameIncrement: item.flameIncrement,
  //       flameMultiplier: 1,
  //     }) - 1
  //   ];

  // const fireBoosterFullTime = firebooster.timeLeft;
  // setTimeout(() => {
  //   clearInterval(intervalID);
  //   userSubject
  //     .pipe(map((user) => removeFireBooster(user, firebooster))) //radi isto kao gore!!!!
  //     .subscribe(userSubject);
  // }, fireBoosterFullTime * 1000 + 1);

  // const intervalID = setInterval(() => {
  //   userSubject
  //     .pipe(map((user) => clockFireBooster(user, firebooster)))
  //     .subscribe(userSubject);
  // }, 1000);

  return newUser;
}
export function insertFirewoodItem(user: User, item: FirewoodItem): User {
  if (!user.inventory.firewoodItems[item.name]) return user;
  const newUser: User = cloneFirewoodItems(user, cloneUserDepth2(user));

  newUser.inventory.firewoodItems[item.name].quantity--;
  if (newUser.inventory.firewoodItems[item.name].quantity === 0)
    delete newUser.inventory.firewoodItems[item.name];

  if (!getDictElements(newUser.gameInfo.firewood).includes(item.name))
    newUser.gameInfo.firewood[item.name] = {
      combustionFactor: item.combustionFactor,
      totalFirewoodContribution: 0,
    }; //isto kao gore!!!
  newUser.gameInfo.firewood[item.name].totalFirewoodContribution +=
    item.firewoodContribution;
  return newUser;
}



export function clockFireBooster(user: User, firebooster: FireBooster): User {
  firebooster.timeLeft--;
  return user;
}
export function removeFireBooster(user: User, firebooster: FireBooster): User {
  user.gameInfo.fireboosters = user.gameInfo.fireboosters.filter(
    (booster) => booster !== firebooster
  );
  user.gameInfo.totalFlameIncrement -= firebooster.flameIncrement;
  user.gameInfo.totalFlameMultiplier /= firebooster.flameMultiplier;
  user.gameInfo.flameBaseLevel = evaluateFireLevel(user.gameInfo);
  return user;
}

export function cloneFirewoodItems(src: User, dest: User): User {
  getDictElements(dest.inventory.firewoodItems).forEach((x) => {
    dest.inventory.firewoodItems[x] = {
      ...src.inventory.firewoodItems[x],
    };
  });
  return dest;
}
export function cloneFlammableItems(src: User, dest: User): User {
  getDictElements(dest.inventory.flammableItems).forEach((x) => {
    dest.inventory.flammableItems[x] = {
      ...src.inventory.flammableItems[x],
    };
  });
  return dest;
}

export function cloneFirestarterItems(src: User, dest: User): User {
  getDictElements(dest.inventory.firestarterItems).forEach((x) => {
    dest.inventory.firestarterItems[x] = {
      ...src.inventory.firestarterItems[x],
    };
  });
  return dest;
}
