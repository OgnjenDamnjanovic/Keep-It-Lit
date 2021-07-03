import { from, Observable, zip } from "rxjs";
import { concatMap, filter, map, toArray } from "rxjs/operators";
import {
  getFirestarterItemByID,
  getFirewoodItemByID,
  getFlammableItemByID,
} from "../../services/DB services/store.service";
import { FirestarterItem } from "../firestarter-item";
import { FirewoodItem } from "../firewood-item";
import { FlammableItem } from "../flammable-item";
import { Inventory } from "../inventory";
import { InventoryItem } from "../inventory-item";

export interface InventoryDTO {
  flammableItems: Array<InventoryItem<number>>;
  firewoodItems: Array<InventoryItem<number>>;
  firestarterItems: Array<InventoryItem<number>>;
}

export function inventoryDTOtoInventoryObs(inventoryDTO: InventoryDTO) {
  return zip(
    from(inventoryDTO.firewoodItems)
      .pipe(
        concatMap((firewoodItemDTO) =>
          getFirewoodItemByID(firewoodItemDTO.item)
        ),
        filter((item) => Object.keys(item).length > 0),
        map(
          (item, index) =>
            new InventoryItem<FirewoodItem>(
              item,
              inventoryDTO.firewoodItems[index].quantity
            )
        )
      )
      .pipe(toArray()),
    from(inventoryDTO.flammableItems)
      .pipe(
        concatMap((flammableItemDTO) =>
          getFlammableItemByID(flammableItemDTO.item)
        ),
        filter((item) => Object.keys(item).length > 0),
        map(
          (item, index) =>
            new InventoryItem<FlammableItem>(
              item,
              inventoryDTO.flammableItems[index].quantity
            )
        )
      )
      .pipe(toArray()),
    from(inventoryDTO.firestarterItems)
      .pipe(
        concatMap((firestarterItemDTO) =>
          getFirestarterItemByID(firestarterItemDTO.item)
        ),
        filter((item) => Object.keys(item).length > 0),
        map(
          (item, index) =>
            new InventoryItem<FirestarterItem>(
              item,
              inventoryDTO.firestarterItems[index].quantity
            )
        )
      )
      .pipe(toArray())
  ).pipe(map((items) => new Inventory(items[1], items[0], items[2])));
}
export function InventoryToInventoryDTO(inv: Inventory): InventoryDTO {
  return {
    firestarterItems: Object.getOwnPropertyNames(inv.firestarterItems).map(
      (prop) =>
        new InventoryItem<number>(
          inv.firestarterItems[prop].item.id,
          inv.firestarterItems[prop].quantity
        )
    ),
    firewoodItems: Object.getOwnPropertyNames(inv.firewoodItems).map(
      (prop) =>
        new InventoryItem<number>(
          inv.firewoodItems[prop].item.id,
          inv.firewoodItems[prop].quantity
        )
    ),
    flammableItems: Object.getOwnPropertyNames(inv.flammableItems).map(
      (prop) =>
        new InventoryItem<number>(
          inv.flammableItems[prop].item.id,
          inv.flammableItems[prop].quantity
        )
    ),
  };
}
