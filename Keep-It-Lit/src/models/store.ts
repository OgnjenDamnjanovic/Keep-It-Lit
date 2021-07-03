import { FirestarterItem } from "./firestarter-item";
import { FirewoodItem } from "./firewood-item";
import { FlammableItem } from "./flammable-item";

export interface Store{
    firewoodItems:Array<FirewoodItem>;
    flammableItems:Array<FlammableItem>;
    firestarterItems:Array<FirestarterItem>;
}
