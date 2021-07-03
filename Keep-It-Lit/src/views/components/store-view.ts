import {
  BehaviorSubject,
  forkJoin,
  fromEvent,
  observable,
  Observable,
  zip,
} from "rxjs";
import {
  filter,
  map,
  share,
  skipUntil,
  switchMap,
  withLatestFrom,
} from "rxjs/operators";
import { GAME_IMAGES_LOCATION } from "../../misc/AssetsURL";
import { FirestarterItem } from "../../models/firestarter-item";
import { FirewoodItem } from "../../models/firewood-item";
import { FlammableItem } from "../../models/flammable-item";
import {
  buyFirestarterItem,
  buyFirewoodItem,
  buyFlammableItem,
  User,
} from "../../models/user";
import { getAllStoreItems } from "../../services/DB services/store.service";
import { updateUserObs } from "../../services/DB services/user.service";
import { createElement, createImage } from "../../services/DOM.service";

export class StoreView {
  private userSubject: BehaviorSubject<User>;
  private _container: HTMLFormElement;
  constructor(mainContainer: HTMLElement, userSubject: BehaviorSubject<User>) {
    this._container = <HTMLFormElement>(
      createElement("div", mainContainer, "storeContainer", "")
    );
    this.userSubject = userSubject;
  }

  renderContent() {
    getAllStoreItems().subscribe((store) => {
      store.firewoodItems.map((fwItem) =>
        this.drawStoreItem(fwItem, buyFirewoodItem)
      );
      store.flammableItems.map((fmItem) =>
        this.drawStoreItem(fmItem, buyFlammableItem)
      );
      store.firestarterItems.map((fsItem) =>
        this.drawStoreItem(fsItem, buyFirestarterItem)
      );
    });
  }
  drawStoreItem(
    item: FirewoodItem | FlammableItem | FirestarterItem,
    buyItemCallback: Function
  ) {
    const itemContainer = createElement(
      "span",
      this._container,
      "storeItemContainer",
      ""
    );
    createImage(
      itemContainer,
      "storeitemImage",
      GAME_IMAGES_LOCATION + item.imageSrc,
      85,
      85
    );
    createElement(
      "span",
      itemContainer,
      "storeItemPrice",
      `<label>${item.price}</label> <i class='fa fa-coins'></i>`
    );
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
