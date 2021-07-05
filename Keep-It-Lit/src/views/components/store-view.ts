import { BehaviorSubject, fromEvent, Observable, zip } from "rxjs";
import {
  distinctUntilChanged,
  distinctUntilKeyChanged,
  filter,
  map,
  share,
  switchMap,
  take,
  tap,
  withLatestFrom,
} from "rxjs/operators";
import { GAME_IMAGES_LOCATION } from "../../misc/AssetsURL";
import { FirestarterItem } from "../../models/firestarter-item";
import { FirewoodItem } from "../../models/firewood-item";
import { FlammableItem } from "../../models/flammable-item";
import { createEmptyInventory, Inventory } from "../../models/inventory";
import { Store } from "../../models/store";
import {
  buyFirestarterItem,
  buyFirewoodItem,
  buyFlammableItem,
  User,
} from "../../models/user";
import { getAllStoreItems } from "../../services/DB services/store.service";
import { updateUserObs } from "../../services/DB services/user.service";
import {
  createButton,
  createElement,
  createImage,
} from "../../services/DOM.service";

export class StoreView {
  private userSubject: BehaviorSubject<User>;
  private _container: HTMLFormElement;
  constructor(mainContainer: HTMLElement, userSubject: BehaviorSubject<User>) {
    this._container = <HTMLFormElement>(
      createElement("div", mainContainer, "storeContainer", "")
    );
    this.userSubject = userSubject;
    this.userSubject
      .pipe(distinctUntilKeyChanged("balance"))
      .subscribe((user) => {
        this.disableExpensiveItems(user.balance);
        this.renderBalance(user.balance);
      });
  }

  renderContent() {
    const leftArrow =
      "<i class='fas fa-caret-left'></i><div>S<br/>T<br/>O<br/>R<br/>E</div>";
    const rightArrow =
      "<i class='fas fa-caret-right'></i><div>S<br/>T<br/>O<br/>R<br/>E</div>";
    createElement("div", this._container, "storeSpacer", "");
    const showStoreBtn: HTMLButtonElement = createButton(
      this._container,
      "storeShowBtn",
      leftArrow,
      () => {
        if (window.getComputedStyle(itemsContainer).display === "none") {
          showStoreBtn.innerHTML = rightArrow;
          itemsContainer.style.display = "flex";
          balanceLabel.classList.add("balanceLabelOffset");
          showStoreBtn.classList.add("storeShowBtnOffset");
        } else {
          showStoreBtn.innerHTML = leftArrow;
          itemsContainer.style.display = "none";
          balanceLabel.classList.remove("balanceLabelOffset");
          showStoreBtn.classList.remove("storeShowBtnOffset");
        }
      }
    );

    const itemsContainer = <HTMLDivElement>(
      createElement("div", this._container, "storeItemsCont", "")
    );
    const balanceLabel = createElement(
      "label",
      this._container,
      "balanceLabel",
      ""
    );
    getAllStoreItems()
      .pipe(withLatestFrom(this.userSubject.pipe(map((user) => user.balance))))
      .subscribe((str: [Store, number]) => {
        str[0].firewoodItems.map((fwItem) =>
          this.renderStoreItem(fwItem, buyFirewoodItem, itemsContainer)
        );
        str[0].flammableItems.map((fmItem) =>
          this.renderStoreItem(fmItem, buyFlammableItem, itemsContainer)
        );
        str[0].firestarterItems.map((fsItem) =>
          this.renderStoreItem(fsItem, buyFirestarterItem, itemsContainer)
        );
        this.disableExpensiveItems(str[1]);
        this.renderBalance(str[1]);
      });
  }
  disableExpensiveItems(balance: number) {
    this._container
      .querySelectorAll(".storeItemPrice")
      .forEach((itemPriceDiv: HTMLDivElement) => {
        itemPriceDiv.parentElement.classList.remove("disabledDiv");
        if (parseInt(itemPriceDiv.getAttribute("price")) > balance)
          itemPriceDiv.parentElement.classList.add("disabledDiv");
      });
  }
  renderBalance(balance: number) {
    const balanceLabel = document.querySelector(".balanceLabel");
    if (balanceLabel)
      balanceLabel.innerHTML = `${balance.toString()}   <i class='fa fa-coins'></i>`;
  }
  renderStoreItem(
    item: FirewoodItem | FlammableItem | FirestarterItem,
    buyItemCallback: Function,
    parent: HTMLDivElement
  ) {
    const itemContainer = createElement(
      "div",
      parent,
      "storeItemContainer",
      ""
    );
    createImage(
      itemContainer,
      "storeitemImage",
      GAME_IMAGES_LOCATION + item.imageSrc,
      95,
      80
    );
    createElement(
      "div",
      itemContainer,
      "storeItemPrice",
      `<label>${item.price}</label> <i class='fa fa-coins'></i>`
    ).setAttribute("price", item.price.toString());
    const newUserStateObs: Observable<User> = fromEvent(
      itemContainer,
      "click"
    ).pipe(
      withLatestFrom(this.userSubject),
      filter((evUser) => item.price <= evUser[1].balance),
      map((evAndUser) => buyItemCallback(evAndUser[1], item)),
      share()
    );

    zip(
      newUserStateObs.pipe(switchMap((user) => updateUserObs(user))),
      newUserStateObs
    )
      .pipe(map((x) => x[1]))
      .subscribe(this.userSubject);
  }
}
