import { BehaviorSubject, Subscription, timer } from "rxjs";
import { map, withLatestFrom } from "rxjs/operators";
import { AMBER_TO_FIRE_RATIO, BURN_FACTOR, EMBER_TO_ASH_FACTOR, MAX_BASE_FIRE_LEVEL, MONEY_INCREMENT } from "../misc/GameConfig";
import { evaluateFireLevel } from "../models/fireplace";
import { FirestarterItem } from "../models/firestarter-item";
import { FirewoodItem } from "../models/firewood-item";
import { FlammableItem } from "../models/flammable-item";
import { User } from "../models/user";
import { updateUserObs } from "../services/DB services/user.service";
import { cloneFirewoodComponents, cloneUserDepth2 } from "./common";

export function burn(user: User, burnPercent: number): User {
  const newUser: User = cloneFirewoodComponents(user, cloneUserDepth2(user));
  
  let totalBurnt = 0;
  Object.keys(newUser.gameInfo.firewood).map((key) => {
    let diff =
      newUser.gameInfo.firewood[key].totalFirewoodContribution *
      newUser.gameInfo.firewood[key].combustionFactor *
      evaluateFireLevel(user.gameInfo) *
      burnPercent*BURN_FACTOR;
      
    if (diff > newUser.gameInfo.firewood[key].totalFirewoodContribution) {
      totalBurnt += newUser.gameInfo.firewood[key].totalFirewoodContribution;
      delete newUser.gameInfo.firewood[key];
    } else {
      totalBurnt += diff;
      newUser.gameInfo.firewood[key].totalFirewoodContribution -= diff;
      if(newUser.gameInfo.firewood[key].totalFirewoodContribution<1) 
      delete newUser.gameInfo.firewood[key];
    }
  });
  newUser.gameInfo.emberAmount -=newUser.gameInfo.emberAmount*EMBER_TO_ASH_FACTOR*evaluateFireLevel(user.gameInfo);
  if (newUser.gameInfo.emberAmount < 1) newUser.gameInfo.emberAmount = 0;

  newUser.gameInfo.emberAmount += totalBurnt;
  newUser.gameInfo.flameBaseLevel = newUser.gameInfo.emberAmount*AMBER_TO_FIRE_RATIO;
  if(newUser.gameInfo.flameBaseLevel>MAX_BASE_FIRE_LEVEL) newUser.gameInfo.flameBaseLevel=MAX_BASE_FIRE_LEVEL;
  if(newUser.gameInfo.flameBaseLevel>0)
  newUser.balance+=MONEY_INCREMENT;
  return Object.freeze(newUser);
}

export function insertFirewoodItem(user: User, item: FirewoodItem): User {
  const newUser: User = cloneUserDepth2(user);
  newUser.inventory.firewoodItems[item.name] = {
    ...newUser.inventory.firewoodItems[item.name],
  };

  newUser.inventory.firewoodItems[item.name].quantity--;
  if (newUser.inventory.firewoodItems[item.name].quantity === 0)
    delete newUser.inventory.firewoodItems[item.name];

  if (!newUser.gameInfo.firewood[item.name])
    newUser.gameInfo.firewood[item.name] = {
      combustionFactor: item.combustionFactor,
      totalFirewoodContribution: 0,
    };
  else {
    newUser.gameInfo.firewood[item.name] = {
      ...newUser.gameInfo.firewood[item.name],
    };
  }
  newUser.gameInfo.firewood[item.name].totalFirewoodContribution +=
    item.firewoodContribution;
  return Object.freeze(newUser);
}

export function insertFirestarterItem(
  user: User,
  item: FirestarterItem,
  userSubject: BehaviorSubject<User>
): User {
  const newUser: User = cloneUserDepth2(user);
  newUser.inventory.firestarterItems[item.name] = {
    ...newUser.inventory.firestarterItems[item.name],
  };
  newUser.inventory.firestarterItems[item.name].quantity--;
  if (newUser.inventory.firestarterItems[item.name].quantity === 0)
    delete newUser.inventory.firestarterItems[item.name];

  newUser.gameInfo.totalFlameIncrement += item.flameIncrement;
  if (item.firewoodContribution > 0) {
    if (!newUser.gameInfo.firewood[item.name])
      newUser.gameInfo.firewood[item.name] = {
        combustionFactor: item.combustionFactor,
        totalFirewoodContribution: 0,
      };
    else
      newUser.gameInfo.firewood[item.name] = {
        ...newUser.gameInfo.firewood[item.name],
      };
    newUser.gameInfo.firewood[item.name].totalFirewoodContribution +=
      item.firewoodContribution;
  }
  const fireboosterKey = Date.now().toString();
  newUser.gameInfo.fireboosters[fireboosterKey] = {
    timeLeft: item.flameIncrementDuration,
    flameIncrement: item.flameIncrement,
    flameMultiplier: 1,
  };

  startFireBoosterTimer(fireboosterKey, userSubject);

  return Object.freeze(newUser);
}

export function startFireBoosterTimer(
  fireboosterKey: string,
  userSubject: BehaviorSubject<User>
) {
  const subscription: Subscription = timer(0, 1000)
    .pipe(
      withLatestFrom(userSubject),
      map((x) =>
        clockFireBooster(x[1], fireboosterKey, subscription, userSubject)
      )
    )
    .subscribe(userSubject);
}
export function clockFireBooster(
  user: User,
  fireboosterIndex: string,
  sub: Subscription,
  userSubject: BehaviorSubject<User>
): User {
  const newUser: User = cloneUserDepth2(user);
  newUser.gameInfo.fireboosters[fireboosterIndex] = {
    ...user.gameInfo.fireboosters[fireboosterIndex],
    timeLeft: user.gameInfo.fireboosters[fireboosterIndex].timeLeft - 1,
  };
  if (newUser.gameInfo.fireboosters[fireboosterIndex].timeLeft == 0) {
    sub.unsubscribe();
    userSubject.next(removeFireBooster(newUser, fireboosterIndex));
    updateUserObs(newUser);
  }
  return Object.freeze(newUser);
}
export function insertFlammableItem(
  user: User,
  item: FlammableItem,
  userSubject: BehaviorSubject<User>
): User {
  const newUser: User = cloneUserDepth2(user);
  newUser.inventory.flammableItems[item.name] = {
    ...newUser.inventory.flammableItems[item.name],
  };

  newUser.inventory.flammableItems[item.name].quantity--;
  if (newUser.inventory.flammableItems[item.name].quantity === 0)
    delete newUser.inventory.flammableItems[item.name];
  if (evaluateFireLevel(newUser.gameInfo) != 0) {
    newUser.gameInfo.totalFlameMultiplier *= item.flameMultiplier;

    const fireboosterKey = Date.now().toString();
    newUser.gameInfo.fireboosters[fireboosterKey] = {
      timeLeft: item.flameMultiplierDuration,
      flameIncrement: 0,
      flameMultiplier: item.flameMultiplier,
    };

    startFireBoosterTimer(fireboosterKey, userSubject);
  }

  return Object.freeze(newUser);
}

export function removeFireBooster(user: User, fireboosterIndex: string): User {
  user.gameInfo.totalFlameIncrement -=
    user.gameInfo.fireboosters[fireboosterIndex].flameIncrement;
  user.gameInfo.totalFlameMultiplier /=
    user.gameInfo.fireboosters[fireboosterIndex].flameMultiplier;
  delete user.gameInfo.fireboosters[fireboosterIndex];
  return user;
}
