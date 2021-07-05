import { Dictionary } from "../misc/Dictionary";
import { FireBooster } from "./firebooster";
import { FirewoodComponent } from "./firewood-component";

export interface Fireplace{
    firewood: Dictionary<FirewoodComponent>
    emberAmount: number,
    flameBaseLevel:number,
    fireboosters:Array<FireBooster>;
    totalFlameMultiplier:number;
    totalFlameIncrement:number;
   
}
export function evaluateFireLevel(fireplace:Fireplace):number {
    return (fireplace.flameBaseLevel+fireplace.totalFlameIncrement)*fireplace.totalFlameMultiplier;
}
