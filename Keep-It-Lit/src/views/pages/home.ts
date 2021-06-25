import { IMAGES_LOCATION } from "../../misc/AssetsURL";
import { Page } from "../../misc/Page";
import {
  createButton,
  createElement,
  createImage,
} from "../../services/DOM.service";
import { Router } from "../router";

export class Home {
  private _container: HTMLElement;
  constructor(private mainContainer: HTMLElement) {}

  renderContent() {
    this._container = createElement(
      "div",
      this.mainContainer,
      "homeContainer",
      ""
    );
    createElement("h1", this._container, "gameTitle", "Keep it Lit");
    createImage(
      this._container,
      "homeImage",
      IMAGES_LOCATION + "thumbMark.jpg",
      650,
      420
    );
    createElement(
      "h3",
      this._container,
      "gameDescription",
      "This is Mark. He is a web developer.<br> Keep him warm so he may continue creating web apps and eventualy open his own startup.<br> If you do this, he will keep giving you money for fire mantainance material, and the rest is yours to spend :)"
    );
    createButton(this._container, "playButton", "PLAY", () => {
      Router.Navigator.goTo(Page.Login);
    });
  }
}
