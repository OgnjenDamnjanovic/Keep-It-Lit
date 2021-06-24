import { ErrorCodes } from "../../misc/ErrorCodes";
import { userLogin } from "../../services/DB services/user.service";
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
      createElement("form", mainContainer, "homeForm", "")
    );
  }
  renderContent() {
    createElement(
      "h2",
      this._container,
      "homeHeadline",
      "ENTER YOUR CREDENTIALS:"
    );
    const usernemeElement = createInput(
      "text",
      this._container,
      "loginInput",
      true,
      "Username"
    );
    const passwordElement = createInput(
      "password",
      this._container,
      "loginInput",
      true,
      "Password"
    );
    createButton(this._container, "loginSubmitBtn", "Login", null);
    this._container.onsubmit = () => {
      userLogin(usernemeElement.value, passwordElement.value).subscribe({
        //predlozeno u dokumentaciji za kad se handle greska
        next: (v) => console.log(v),
        error: (e) => {
          if (e.message === ErrorCodes.userNotFound.toString())
            alert("Wrong credentials");
        },
      });

      return false;
    };
  }
}
