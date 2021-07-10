import { DisposableView } from "../page-interfaces/DisposableView";
import { createElement, createImage } from "../../services/DOM.service";
import { ParametrizedView } from "../page-interfaces/ParametrizedView";
import { isUser, User } from "../../models/user";
import { BehaviorSubject } from "rxjs";
import { StoreView } from "../components/store-view";
import { InventoryView } from "../components/inventory-view";
import { IMAGES_LOCATION } from "../../misc/AssetsURL";
import { FireplaceView } from "../components/fireplace-view";

export class Game implements DisposableView {
  private _container: HTMLFormElement;
  private userSubject: BehaviorSubject<User>;
  constructor(mainContainer: HTMLElement, parameter: User) {
    this._container = <HTMLFormElement>(
      createElement("div", mainContainer, "gameContainer", "")
    );
    this.userSubject = new BehaviorSubject<User>(parameter);

  }

  renderContent() {
    new FireplaceView(this._container,this.userSubject).renderContent();
    new InventoryView(this._container,this.userSubject).renderContent();
    new StoreView(this._container, this.userSubject).renderContent();
    
    
    
  }
  dispose() {}
  static anyToPageParameter(parameter: any): User {
    if (isUser(parameter)) return <User>parameter;
    throw new Error("Invalid GamePage parameter");
  }
}
const __assertStaticInterface: ParametrizedView<User> = Game;
