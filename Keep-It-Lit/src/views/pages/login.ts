import { ErrorCodes } from "../../misc/ErrorCodes";
import { Page } from "../../misc/Page";
import { getUserObs } from "../../services/DB services/user.service";
import {
  createButton,
  createElement,
  createInput,
} from "../../services/DOM.service";
import { Router } from "../router";

export class Login {
  private _container: HTMLFormElement;
  constructor(mainContainer: HTMLElement) {
    this._container = <HTMLFormElement>(
      createElement("form", mainContainer, "loginForm", "")
    );
  }
  renderContent() {
    createElement(
      "h2",
      this._container,
      "loginHeadline",
      "ENTER YOUR CREDENTIALS:"
    );
    const usernameInput:HTMLInputElement = createInput(
      "text",
      this._container,
      "loginInput",
      true,
      "Username"
    );
    const passwordInput:HTMLInputElement = createInput(
      "password",
      this._container,
      "loginInput",
      true,
      "Password"
    );
    createButton(this._container, "loginSubmitBtn", "Login", null);
    this._container.onsubmit = () => {
      getUserObs(usernameInput.value, passwordInput.value).subscribe({
        //predlozeno u dokumentaciji za kad se handle greska
        next: (v) => console.log(v),
        error: (e) => {
          if (e.message === ErrorCodes.userNotFound.toString())
            alert("Wrong credentials");
        },
      });

      return false;
    };
    const noAcc:HTMLAnchorElement=<HTMLAnchorElement>createElement('a',this._container,'dontHaveAcc','I don\'t have an acount');
    noAcc.onclick=()=>Router.Navigator.goTo(Page.Register)
  }
}
