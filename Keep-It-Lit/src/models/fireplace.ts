import { Dictionary, sameDictKeys } from "../misc/Dictionary";
import { areSameFireboosters, FireBooster } from "./firebooster";
import {
  areSameFirewoodComponents,
  FirewoodComponent,
} from "./firewood-component";

export interface Fireplace {
  firewood: Dictionary<FirewoodComponent>;
  emberAmount: number;
  flameBaseLevel: number;
  fireboosters: Dictionary<FireBooster>;
  totalFlameMultiplier: number;
  totalFlameIncrement: number;
}
export function evaluateFirewood(fireplace: Fireplace): number {
  if(Object.keys(fireplace.firewood).length===0)return 0;
  return Object.keys(fireplace.firewood).map(key=>fireplace.firewood[key].totalFirewoodContribution).reduce((prev,curr)=>prev+curr)
}
export function evaluateFireLevel(fireplace: Fireplace): number {
  return (
    (fireplace.flameBaseLevel + fireplace.totalFlameIncrement) *
    fireplace.totalFlameMultiplier
  );
}

export function areSameFireplace(
  fireplaceA: Fireplace,
  fireplaceB: Fireplace
): boolean {
 
  if (
    fireplaceA.emberAmount != fireplaceB.emberAmount ||
    fireplaceA.flameBaseLevel != fireplaceB.flameBaseLevel ||
    fireplaceA.totalFlameIncrement != fireplaceB.totalFlameIncrement ||
    fireplaceA.totalFlameMultiplier != fireplaceB.totalFlameMultiplier ||
    !sameDictKeys(fireplaceB.fireboosters, fireplaceA.fireboosters) ||
    !sameDictKeys(fireplaceA.firewood, fireplaceB.firewood)
  )
    return false;

  for (const key in fireplaceA.firewood) {
    if (
      !areSameFirewoodComponents(
        fireplaceB.firewood[key],
        fireplaceA.firewood[key]
      )
    )
      return false;
  }
  for (const key in fireplaceA.fireboosters) {
    if (
      !areSameFireboosters(
        fireplaceB.fireboosters[key],
        fireplaceA.fireboosters[key]
      )
    )
      return false;
  }

  return true;
}
export function haveSameFireplaceStats(
  fireplaceA: Fireplace,
  fireplaceB: Fireplace
): boolean {
 
  if (
    fireplaceA.emberAmount !== fireplaceB.emberAmount ||
    fireplaceA.flameBaseLevel !== fireplaceB.flameBaseLevel ||
    fireplaceA.totalFlameIncrement !== fireplaceB.totalFlameIncrement ||
    fireplaceA.totalFlameMultiplier !== fireplaceB.totalFlameMultiplier ||
    !sameDictKeys(fireplaceA.firewood, fireplaceB.firewood)
  )
    return false;

  for (const key in fireplaceA.firewood) {
    if (
      !areSameFirewoodComponents(
        fireplaceB.firewood[key],
        fireplaceA.firewood[key]
      )
    )
      return false;
  }
  
 
  return true;
}

