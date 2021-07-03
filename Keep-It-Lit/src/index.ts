import { BehaviorSubject, Subject } from "rxjs";
import { Page } from "./misc/Page";
import { Router } from "./views/router";

Router.Navigator.goTo(Page.Home);
// const fooSubject = new BehaviorSubject(null);

// const barSubject = new Subject();
// barSubject.subscribe(fooSubject);

// barSubject.next('bar');


// fooSubject.subscribe(x=>console.log(x));

//from event click prenamapira se na novo stanje kroz funkciju, iskombinuje se sa poslednjom vrednoscu, subscribe pa se ne zove next nego se prosledi subject koji ce onda to da emituje 