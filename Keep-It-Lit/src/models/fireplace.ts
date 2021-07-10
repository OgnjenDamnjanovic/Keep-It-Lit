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
