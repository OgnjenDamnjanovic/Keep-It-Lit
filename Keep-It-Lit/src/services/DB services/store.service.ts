import { from, zip } from "rxjs";
import { Observable } from "rxjs/internal/Observable";
import {  map } from "rxjs/operators";
import { FIRESTARTER_ITEMS_URL, FIREWOOD_ITEMS_URL, FLAMMABLE_ITEMS_URL } from "../../misc/API URLs";
import { FirestarterItem } from "../../models/firestarter-item";
import { FirewoodItem } from "../../models/firewood-item";
import { FlammableItem } from "../../models/flammable-item";
import { Store } from "../../models/store";

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
export function getFirestarterItemByID(id: number): Observable<FirestarterItem> {
  return from(
    fetch(FIRESTARTER_ITEMS_URL + `${id}`).then((result) => result.json())
  );
}

export function getAllStoreItems(): Observable<Store> {
  return zip(
    from(
      fetch(FLAMMABLE_ITEMS_URL)
        .then((result) => result.json())
        .then((items: FlammableItem[]) => items)
    ),
    from(
      fetch(FIREWOOD_ITEMS_URL)
        .then((result) => result.json())
        .then((items: FirewoodItem[]) => items)
    ),
    from(
      fetch(FIRESTARTER_ITEMS_URL)
        .then((result) => result.json())
        .then((items: FirestarterItem[]) => items)
    )
  ).pipe(
    map((storeItems) => ({
      flammableItems: storeItems[0],
      firewoodItems: storeItems[1],
      firestarterItems:storeItems[2]
    }))
  );
}
