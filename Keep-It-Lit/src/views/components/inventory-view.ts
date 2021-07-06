import { fromEvent, Observable, zip } from "rxjs";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import {
  distinctUntilKeyChanged,
  map,
  share,
  switchMap,
  tap,
  withLatestFrom,
} from "rxjs/operators";
import { GAME_IMAGES_LOCATION } from "../../misc/AssetsURL";
import { getDictElements } from "../../misc/Dictionary";
import { FirestarterItem } from "../../models/firestarter-item";
import { FirewoodItem } from "../../models/firewood-item";
import { FlammableItem } from "../../models/flammable-item";
import { areSameInventories, Inventory } from "../../models/inventory";
import { InventoryItem } from "../../models/inventory-item";
import {
  insertFirestarterItem,
  insertFirewoodItem,
  insertFlammableItem,
  User,
} from "../../models/user";
import { updateUserObs } from "../../services/DB services/user.service";
import { createElement, createImage } from "../../services/DOM.service";

export class InventoryView {
  private userSubject: BehaviorSubject<User>;
  private _container: HTMLFormElement;
  constructor(mainContainer: HTMLElement, userSubject: BehaviorSubject<User>) {
    this._container = <HTMLFormElement>(
      createElement("div", mainContainer, "inventoryContainer", "")
    );
    this.userSubject = userSubject;
  }

  renderContent() {
    this.userSubject
      .pipe(distinctUntilKeyChanged("inventory", areSameInventories))
      .subscribe((User) => this.renderInventory(User.inventory));
  }
  renderInventory(inventory: Inventory) {
    this._container.innerHTML = "";
    if (getDictElements(inventory.firewoodItems).length !== 0)
      createElement("h2", this._container, "", "Firewoods:");
    getDictElements(inventory.firewoodItems).map((itemName) =>
      this.renderInventoryItem(
        inventory.firewoodItems[itemName],
        insertFirewoodItem
      )
    );
    if (getDictElements(inventory.flammableItems).length !== 0)
      createElement("h2", this._container, "", "Flammables:");
    getDictElements(inventory.flammableItems).map((itemName) =>
      this.renderInventoryItem(
        inventory.flammableItems[itemName],
        insertFlammableItem
      )
    );
    if (getDictElements(inventory.firestarterItems).length !== 0)
      createElement("h2", this._container, "", "Firestarters:");
    getDictElements(inventory.firestarterItems).map((itemName) =>
      this.renderInventoryItem(
        inventory.firestarterItems[itemName],
        insertFirestarterItem
      )
    );
  }
  renderInventoryItem(
    item: InventoryItem<FirewoodItem | FirestarterItem | FlammableItem>,
    insertCallback: (
      user: User,
      item: FirewoodItem | FirestarterItem | FlammableItem,
      userSubject: BehaviorSubject<User>
    ) => User
  ) {
    const itemContainer = createElement(
      "span",
      this._container,
      "invItemContainer",
      ""
    );
    const itemImage = createImage(
      itemContainer,
      "invItemImg",
      GAME_IMAGES_LOCATION + item.item.imageSrc,
      100,
      90
    );
    createElement(
      "label",
      itemContainer,
      "ivnItemQuantity",
      `x${item.quantity}`
    );

    fromEvent(itemImage, "click")
      .pipe(
        withLatestFrom(this.userSubject),
        map((evAndUser) =>
          insertCallback(evAndUser[1], item.item, this.userSubject)
        ),
        tap((user) => updateUserObs(user)) //da subscribe ne ceka upis, pa da vrati user-a koji je u medjuvremenu izmenjen zbog timera
      )
      .subscribe(this.userSubject);
  }
}
