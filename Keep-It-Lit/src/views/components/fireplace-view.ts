import { forkJoin, interval, Subject, Subscription, timer } from "rxjs";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import {
  distinctUntilKeyChanged,
  map,
  repeatWhen,
  skip,
  take,
  takeUntil,
  withLatestFrom,
} from "rxjs/operators";
import { IMAGES_LOCATION } from "../../misc/AssetsURL";
import { getDictElements } from "../../misc/Dictionary";
import {
  FIRE_GIF_RATIO,
  FIRE_LEVEL1_TRASHOLD,
  FIRE_LEVEL2_TRASHOLD,
  FIRE_LEVEL3_TRASHOLD,
  FIRE_LEVEL4_TRASHOLD,
  LOG_TRASHOLD,
} from "../../misc/GameConfig";
import {
  evaluateFireLevel,
  evaluateFirewood,
  Fireplace,
  haveSameFireplaceStats,
} from "../../models/fireplace";
import { User } from "../../models/user";
import { burn, startFireBoosterTimer } from "../../reducers/fireplace.reducer";
import { createElement, createImage } from "../../services/DOM.service";
import { DisposableView } from "../page-interfaces/DisposableView";

export class FireplaceView implements DisposableView {
  private _container: HTMLFormElement;
  private burnTimerSubscription: Subscription;
  private burnTimerDisruptorSubscription: Subscription;
  private gameInfoSubscription: Subscription;

  constructor(
    mainContainer: HTMLElement,
    private userSubject: BehaviorSubject<User>
  ) {
    this._container = <HTMLFormElement>(
      createElement("div", mainContainer, "fireplaceContainer", "")
    );

    this.userSubject.pipe(take(1)).subscribe((user) => {
      getDictElements(user.gameInfo.fireboosters).forEach((fireboosterName) => {
        startFireBoosterTimer(fireboosterName, userSubject);
      });
    });

    const stop = new Subject<void>();
    const start = new Subject<void>();
    const burnTimeMS = 5000;
    let startTime: number = Date.now();
    this.burnTimerSubscription = timer(burnTimeMS, burnTimeMS)
      .pipe(
        withLatestFrom(this.userSubject),
        map((user) => burn(user[1], (Date.now() - startTime) / burnTimeMS)),
        takeUntil(stop),
        repeatWhen(() => start)
      )
      .subscribe((user) => {
        this.userSubject.next(user);
        startTime = Date.now();
      });

    this.burnTimerDisruptorSubscription = this.userSubject
      .pipe(
        skip(1),
        distinctUntilKeyChanged("gameInfo", (x: Fireplace, y: Fireplace) => {
          return (
            x.totalFlameIncrement != y.totalFlameIncrement ||
            x.totalFlameMultiplier != x.totalFlameIncrement
          );
        })
      )
      .subscribe((user) => {
        stop.next();
        this.userSubject.next(
          burn(user, (Date.now() - startTime) / burnTimeMS)
        );
        startTime = Date.now();
        start.next();
      });
  }
  dispose(): void {
    this.gameInfoSubscription.unsubscribe();
    this.burnTimerSubscription.unsubscribe();
    this.burnTimerDisruptorSubscription.unsubscribe();
  }

  renderContent() {
    this.gameInfoSubscription = this.userSubject
      .pipe(distinctUntilKeyChanged("gameInfo", haveSameFireplaceStats))
      .subscribe((User) => {
        this._container.innerHTML = "";
        createImage(
          this._container,
          "fullMark1",
          IMAGES_LOCATION + "fullMark1.jpg",
          1400,
          900
        );
        const fireHolderDiv = createElement(
          "div",
          this._container,
          "fireHolder",
          ""
        );
        if (evaluateFirewood(User.gameInfo) > LOG_TRASHOLD) {
          createImage(
            this._container,
            "log",
            IMAGES_LOCATION + "162601897664282077.png",
            150,
            75
          );
        }
        const fireLevel = evaluateFireLevel(User.gameInfo);
        if (fireLevel > 0) {
          let fireHeight;
          if (fireLevel > FIRE_LEVEL4_TRASHOLD) fireHeight = 200;
          else if (fireLevel > FIRE_LEVEL3_TRASHOLD) fireHeight = 140;
          else if (fireLevel > FIRE_LEVEL2_TRASHOLD) fireHeight = 80;
          else if (fireLevel > FIRE_LEVEL1_TRASHOLD) fireHeight = 50;
          else fireHeight = 10;

          const fireSpacer = createElement(
            "div",
            fireHolderDiv,
            "fireSpacer",
            ""
          );
          fireSpacer.style.height = 201 - fireHeight + "px";
          fireSpacer.style.width = 175 + "px";
          const fireGif = createImage(
            fireHolderDiv,
            "fire",
            IMAGES_LOCATION + "fire_lower_hue.gif",
            fireHeight * FIRE_GIF_RATIO,
            fireHeight
          );
        }
        createElement("label", this._container, "stats", "");
        this.logStats(User);
      });
  }
  logStats(user: User) {
    const statsLabel = document.querySelector(".stats");
    let stats: string = `TotalfireLevel: ${evaluateFireLevel(
      user.gameInfo
    ).toFixed(2)}\nfireLevel: ${user.gameInfo.flameBaseLevel.toFixed(2)}\nmultiplier: ${
      user.gameInfo.totalFlameMultiplier.toFixed(2)
    }\nincrement: ${user.gameInfo.totalFlameIncrement.toFixed(2)}\n amber:${
      user.gameInfo.emberAmount.toFixed(2)
    }`;
    stats += "\n";
    getDictElements(user.gameInfo.firewood).forEach((prop) => {
      stats += `${prop}{combustion factor: ${user.gameInfo.firewood[prop].combustionFactor.toFixed(2)} firewoodContribution: ${user.gameInfo.firewood[prop].totalFirewoodContribution.toFixed(2)}}\n`;
    });
    stats += "\n";
    getDictElements(user.gameInfo.fireboosters).forEach((fireboosterName) => {
      stats += `increment: ${user.gameInfo.fireboosters[fireboosterName].flameIncrement.toFixed(2)} multiplier: ${user.gameInfo.fireboosters[fireboosterName].flameMultiplier.toFixed(2)} \n`;
    });

    statsLabel.innerHTML = stats;
  }
}
