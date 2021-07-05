import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { map } from "rxjs/operators";
import { getDictElements } from "../../misc/Dictionary";
import { evaluateFireLevel } from "../../models/fireplace";
import { User } from "../../models/user";
import { createElement } from "../../services/DOM.service";

export class FireplaceView {
  private userSubject: BehaviorSubject<User>;
  private _container: HTMLFormElement;
  constructor(mainContainer: HTMLElement, userSubject: BehaviorSubject<User>) {
    this._container = <HTMLFormElement>(
      createElement("div", mainContainer, "fireplaceContainer", "")
    );
    this.userSubject = userSubject;
  }

  renderContent() {
    this.userSubject
      .pipe(
        map((user) => user.gameInfo)
      )
      .subscribe((gameInfo) => {
          let string:string=`TotalfireLevel: ${evaluateFireLevel(gameInfo)}\nmultiplier: ${gameInfo.totalFlameMultiplier}\nincrement: ${gameInfo.totalFlameIncrement}\n` 
          string+='\n'
          getDictElements(gameInfo.firewood).forEach(prop=>{
            string+=`${prop}{combustion factor: ${gameInfo.firewood[prop].combustionFactor} firewoodContribution: ${gameInfo.firewood[prop].totalFirewoodContribution}}\n`
          })
          string+='\n'
          gameInfo.fireboosters.forEach(booster=>{
              string+=`increment: ${booster.flameIncrement} multiplier: ${booster.flameMultiplier} timeleft: ${booster.timeLeft}\n`
          })
          
            console.log(string+"\n\n")
      });
  }
  
}
