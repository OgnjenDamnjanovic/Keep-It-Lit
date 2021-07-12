import { DisposableView } from "../page-interfaces/DisposableView";
import { createElement,  } from "../../services/DOM.service";
import { ParametrizedView } from "../page-interfaces/ParametrizedView";
import { isUser, User } from "../../models/user";
import { BehaviorSubject } from "rxjs";
import { StoreView } from "../components/store-view";
import { InventoryView } from "../components/inventory-view";
import { FireplaceView } from "../components/fireplace-view";

export class Game implements DisposableView {
  private _container: HTMLFormElement;
  private userSubject: BehaviorSubject<User>;
  private fireplaceView: FireplaceView;
  private inventoryView: InventoryView;
  private storeView: StoreView;
  constructor(mainContainer: HTMLElement, parameter: User) {
    this._container = <HTMLFormElement>(
      createElement("div", mainContainer, "gameContainer", "")
    );
    this.userSubject = new BehaviorSubject<User>(parameter);
    this.fireplaceView=new FireplaceView(this._container,this.userSubject)
    this.inventoryView=new InventoryView(this._container,this.userSubject)
    this.storeView=new StoreView(this._container,this.userSubject)
  }

  renderContent() {
    this.fireplaceView.renderContent();
    this.inventoryView.renderContent();
    this.storeView.renderContent();
    
    
    
    
  }
  dispose() {
    this.fireplaceView.dispose();
    this.inventoryView.dispose();
    this.storeView.dispose();

  }
  static anyToPageParameter(parameter: any): User {
    if (isUser(parameter)) return <User>parameter;
    throw new Error("Invalid GamePage parameter");
  }
}
const __assertStaticInterface: ParametrizedView<User> = Game;
