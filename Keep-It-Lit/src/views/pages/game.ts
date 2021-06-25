import { IMAGES_LOCATION } from "../../misc/AssetsURL";
import { DisposableView } from "../../misc/DisposableView";
import { createElement, createImage } from "../../services/DOM.service";

export class Game implements DisposableView{

    private _container:HTMLFormElement
    constructor(mainContainer:HTMLElement){
        this._container=<HTMLFormElement>createElement('form',mainContainer,'homeForm','')
    }
    renderContent(){
        createImage(
            this._container,
            "homeImage ",
            IMAGES_LOCATION + "fullMark.jpg",
            1400,
            900
          );
       
    }
    dispose(){

    }
}