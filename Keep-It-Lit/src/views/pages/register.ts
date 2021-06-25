import { fromEvent, merge } from "rxjs";
import { debounceTime, map, switchMap } from "rxjs/operators";
import { Page } from "../../misc/Page";
import {
  checkUsernameExistsObs,
  createUser,
} from "../../services/DB services/user.service";
import {
  createButton,
  createElement,
  createInput,
} from "../../services/DOM.service";
import { Router } from "../router";

export class Register {
  private _container: HTMLFormElement;
  constructor(mainContainer: HTMLElement) {
    this._container = <HTMLFormElement>(
      createElement("form", mainContainer, "registerForm", "")
    );
  }
  renderContent() {
    createElement(
      "div",
      this._container,
      "",
      "<i class='fas fa-arrow-alt-circle-left backArrow'></i>"
    ).onclick = () => Router.Navigator.goTo(Page.Login);
    createElement(
      "h2",
      this._container,
      "registerHeadline",
      "ENTER YOUR CREDENTIALS:"
    );
    const usernameInput: HTMLInputElement = createInput(
      "text",
      this._container,
      "registerInput",
      true,
      "Username"
    );
    const usernameErrorLabel: HTMLLabelElement = <HTMLLabelElement>(
      createElement(
        "label",
        this._container,
        "registerError errorHidden",
        "Username already taken!"
      )
    );

    fromEvent(usernameInput, "input")
      .pipe(
        debounceTime(800),
        map((ev: InputEvent) => (<HTMLInputElement>ev.target).value),
        switchMap((username) => checkUsernameExistsObs(username))
      )
      .subscribe((exists: boolean) =>
        exists
          ? this.showErrorMessage(usernameErrorLabel)
          : this.hideErrorMessage(usernameErrorLabel)
      );

    const passwordInput: HTMLInputElement = createInput(
      "password",
      this._container,
      "registerInput",
      true,
      "Password"
    );
    const repeatPasswordInput: HTMLInputElement = createInput(
      "password",
      this._container,
      "registerInput",
      true,
      "Password"
    );
    const passswordErrorLabel: HTMLLabelElement = <HTMLLabelElement>(
      createElement(
        "label",
        this._container,
        "passwordError errorHidden",
        "Passwords don't match"
      )
    );
    merge(
      fromEvent(repeatPasswordInput, "input"),
      fromEvent(passwordInput, "input")
    ).subscribe(() => {
      repeatPasswordInput.value === passwordInput.value
        ? this.hideErrorMessage(passswordErrorLabel)
        : this.showErrorMessage(passswordErrorLabel);
    });

    createButton(this._container, "registerSubmitBtn", "Register", null);
    this._container.onsubmit = () => {
      if (
        !usernameErrorLabel.classList.contains("errorVisible") &&
        !passswordErrorLabel.classList.contains("errorVisible")
      ) {
        createUser(usernameInput.value, passwordInput.value).subscribe(
          (response) => {
            if (response.ok) Router.Navigator.goTo(Page.Login);
          }
        );
      }
      return false;
    };
  }
  showErrorMessage(errorLabel: HTMLLabelElement) {
    errorLabel.classList.replace("errorHidden", "errorVisible");
  }
  hideErrorMessage(errorLabel: HTMLLabelElement) {
    errorLabel.classList.replace("errorVisible", "errorHidden");
  }
}
