import { from, zip } from "rxjs";
import { concatMap, filter, map, toArray } from "rxjs/operators";
import { getDictElements } from "../../misc/Dictionary";
import {
  getFirestarterItemByID,
  getFirewoodItemByID,
  getFlammableItemByID,
} from "../../services/DB services/store.service";
import { createInventory, Inventory } from "../inventory";
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
        map((item, index) => ({
          item: item,
          quantity: inventoryDTO.firewoodItems[index].quantity,
        }))
      )
      .pipe(toArray()),
    from(inventoryDTO.flammableItems)
      .pipe(
        concatMap((flammableItemDTO) =>
          getFlammableItemByID(flammableItemDTO.item)
        ),
        filter((item) => Object.keys(item).length > 0),
        map((item, index) => ({
          item: item,
          quantity: inventoryDTO.flammableItems[index].quantity,
        }))
      )
      .pipe(toArray()),
    from(inventoryDTO.firestarterItems)
      .pipe(
        concatMap((firestarterItemDTO) =>
          getFirestarterItemByID(firestarterItemDTO.item)
        ),
        filter((item) => Object.keys(item).length > 0),
        map((item, index) => ({
          item: item,
          quantity: inventoryDTO.firestarterItems[index].quantity,
        }))
      )
      .pipe(toArray())
  ).pipe(map((items) => createInventory(items[1], items[0], items[2])));
}
export function InventoryToInventoryDTO(inv: Inventory): InventoryDTO {
  return {
    firestarterItems: getDictElements(inv.firestarterItems).map((prop) => ({
      item: inv.firestarterItems[prop].item.id,
      quantity: inv.firestarterItems[prop].quantity,
    })),
    firewoodItems: getDictElements(inv.firewoodItems).map((prop) => ({
      item: inv.firewoodItems[prop].item.id,
      quantity: inv.firewoodItems[prop].quantity,
    })),
    flammableItems: getDictElements(inv.flammableItems).map((prop) => ({
      item: inv.flammableItems[prop].item.id,
      quantity: inv.flammableItems[prop].quantity,
    })),
  };
}
