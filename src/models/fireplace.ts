import { Dictionary } from "../misc/Dictionary";
import { FirewoodComponent } from "./firewood-component";

export interface Fireplace{
    firewood: Dictionary<FirewoodComponent>
    emberAmount: number,
    fireLevel:number
    firewoodToEmberConversion:Function,
    emberToAshConversion:Function
}