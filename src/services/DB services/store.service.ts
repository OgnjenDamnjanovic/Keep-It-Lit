import { from, of, throwError } from "rxjs";
import { Observable } from "rxjs/internal/Observable";
import { catchError, map } from "rxjs/operators";
import { FIREWOOD_ITEMS_URL, FLAMMABLE_ITEMS_URL } from "../../misc/API URLs";
import { FirewoodItem } from "../../models/firewood-item";
import { FlammableItem } from "../../models/flammable-item";
import { InventoryItem } from "../../models/inventory-item";

export function getFlammableItemByID(id: number): Observable<FlammableItem> {
  return from(
    fetch(FLAMMABLE_ITEMS_URL + `${id}`).then((result) => result.json())
  );
}
export function getFirewoodItemByID(id: number): Observable<FirewoodItem> {
  return from(
    fetch(FIREWOOD_ITEMS_URL + `${id}`).then((result) => result.json())
  );
}
