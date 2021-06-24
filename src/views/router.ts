import { map } from "rxjs/operators";
import { DisposableView } from "../misc/DisposableView";
import { Page } from "../misc/Page";
import { Game } from "./pages/game";
import { Home } from "./pages/home";
import { Login } from "./pages/login";

export class Router {
  private _mainContainer: HTMLElement;
  private static _navigator: Router;
  private pageToDispose:DisposableView|null
  private constructor() {
    this._mainContainer = document.getElementById("main");
  }

  static get Navigator(): Router {
    return this._navigator ?? (this._navigator = new Router());
  }
  goTo(pageName: Page) {
    this.clearMainContainer();
    this.disposeSubscriptions();
    switch (pageName) {
      case Page.Home:
        new Home(this._mainContainer).renderContent();
        break;
      case Page.Game:
        const game=new Game(this._mainContainer);
        this.pageToDispose=game;
        game.renderContent()
        
        break;
      case Page.Login:
        new Login(this._mainContainer).renderContent();
    }
  }
  clearMainContainer() {
    this._mainContainer.innerHTML = "";
  }
  disposeSubscriptions() {
    if(this.pageToDispose)
    this.pageToDispose.dispose()
  }
}
