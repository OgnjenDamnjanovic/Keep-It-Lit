import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { User } from "../../models/user";
import { createElement } from "../../services/DOM.service";

export class InventoryView {
    private userSubject: BehaviorSubject<User>;
    private _container: HTMLFormElement;
    constructor(mainContainer: HTMLElement, userSubject: BehaviorSubject<User>) {
      this._container = <HTMLFormElement>(
        createElement("div", mainContainer, "storeContainer", "")
      );
      this.userSubject = userSubject;
    }
  
    renderContent() {
      
    }
    
  }
  