import { Dictionary } from "../misc/Dictionary";
import { InventoryDTO } from "./DTOs/inventory-dto";
import { FirewoodItem } from "./firewood-item";
import { FlammableItem } from "./flammable-item";
import { InventoryItem } from "./inventory-item";

export class Inventory{
    flammableItems:Dictionary<InventoryItem<FlammableItem>>={}
    firewoodItems:Dictionary<InventoryItem<FirewoodItem>>={}
    constructor(flammableItems:Array<InventoryItem<FlammableItem>>,firewoodItems:Array<InventoryItem<FirewoodItem>>){

       flammableItems.map(item=>this.flammableItems[item.item.name]=item);
       firewoodItems.map(item=>this.firewoodItems[item.item.name]=item);
    }
}

