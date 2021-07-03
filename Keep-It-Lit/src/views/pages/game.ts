import { DisposableView } from "../page-interfaces/DisposableView";
import { createElement } from "../../services/DOM.service";
import { ParametrizedView } from "../page-interfaces/ParametrizedView";
import { isUser, User } from "../../models/user";
import { BehaviorSubject } from "rxjs";
import { StoreView } from "../components/store-view";
import { userToUserDTO } from "../../models/DTOs/user-dto";

export class Game implements DisposableView {
  private _container: HTMLFormElement;
  private userSubject: BehaviorSubject<User>;
  constructor(mainContainer: HTMLElement, parameter: User) {
    this._container = <HTMLFormElement>(
      createElement("div", mainContainer, "gameContainer", "")
    );
    this.userSubject = new BehaviorSubject<User>(parameter);
    this.userSubject.subscribe((user) => console.log(user));

  }

  renderContent() {
    new StoreView(this._container, this.userSubject).renderContent();
    
  }
  dispose() {}
  static anyToPageParameter(parameter: any): User {
    if (isUser(parameter)) return <User>parameter;
    throw new Error("Invalid GamePage parameter");
  }
}
const __assertStaticInterface: ParametrizedView<User> = Game;
