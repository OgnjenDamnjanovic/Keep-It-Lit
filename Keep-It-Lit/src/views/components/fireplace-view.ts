import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { distinctUntilKeyChanged, map, take } from "rxjs/operators";
import { IMAGES_LOCATION } from "../../misc/AssetsURL";
import { getDictElements } from "../../misc/Dictionary";
import { areSameFireplace, evaluateFireLevel } from "../../models/fireplace";
import { startFireBoosterTimer, User } from "../../models/user";
import { createElement, createImage } from "../../services/DOM.service";

export class FireplaceView {
  private userSubject: BehaviorSubject<User>;
  private _container: HTMLFormElement;
  constructor(mainContainer: HTMLElement, userSubject: BehaviorSubject<User>) {
    this._container = <HTMLFormElement>(
      createElement("div", mainContainer, "fireplaceContainer", "")
    );
    createImage(
      this._container,
      "fullMark",
      IMAGES_LOCATION + "fullMark.jpg",
      1400,
      900
    );

    this.userSubject = userSubject;
    this.userSubject.pipe(take(1)).subscribe((user) => {
      getDictElements(user.gameInfo.fireboosters).forEach((fireboosterName) => {
        startFireBoosterTimer(
          fireboosterName,
          userSubject
        );
      });
    });
  }

  renderContent() {
    this.userSubject
      .pipe(distinctUntilKeyChanged("gameInfo", areSameFireplace))
      .subscribe((User) => {
        console.log("crtam");
        // let string: string = `TotalfireLevel: ${evaluateFireLevel(
        //   User.gameInfo
        // )}\nfireLevel: ${User.gameInfo.flameBaseLevel}\nmultiplier: ${
        //   User.gameInfo.totalFlameMultiplier
        // }\nincrement: ${User.gameInfo.totalFlameIncrement}\n`;
        // string += "\n";
        // getDictElements(User.gameInfo.firewood).forEach((prop) => {
        //   string += `${prop}{combustion factor: ${User.gameInfo.firewood[prop].combustionFactor} firewoodContribution: ${User.gameInfo.firewood[prop].totalFirewoodContribution}}\n`;
        // });
        // string += "\n";
        // getDictElements(User.gameInfo.fireboosters).forEach(
        //   (fireboosterName) => {
        //     string += `increment: ${User.gameInfo.fireboosters[fireboosterName].flameIncrement} multiplier: ${User.gameInfo.fireboosters[fireboosterName].flameMultiplier} timeleft: ${User.gameInfo.fireboosters[fireboosterName].timeLeft}\n`;
        //   }
        // );

        // console.log(string + "\n\n");
      });
  }
}
