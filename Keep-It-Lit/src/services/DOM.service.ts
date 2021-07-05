export function createElement(elementType:string, parentElement: HTMLElement, className: string, innerHTML: string):HTMLElement{
    
    const newElement:HTMLElement=document.createElement(elementType);
    newElement.className=className;
    newElement.innerHTML=innerHTML;
    parentElement.appendChild(newElement)
    return newElement;

}

export function createButton(parentElement: HTMLElement, className: string, innerHTML: string, onClick:(ev:MouseEvent)=>void |null):HTMLButtonElement{
    const newButton=<HTMLButtonElement>createElement('button',parentElement,className,innerHTML);
    newButton.onclick=onClick;
    return newButton
}

export function createInput(inputType:string, parentElement: HTMLElement, className: string, required:boolean, placeholder:string):HTMLInputElement{
    const newElement: HTMLInputElement=<HTMLInputElement>createElement('input', parentElement,className,'');
    newElement.required=required;
    newElement.type=inputType;
    newElement.placeholder=placeholder
    return newElement
}

export function createImage(parentElement: HTMLElement, className: string, src:string, width:number, height:number):HTMLImageElement{
    const newElement:HTMLImageElement=<HTMLImageElement>createElement('img', parentElement,className,'')
    newElement.src=src;
    newElement.width=width;
    newElement.height=height;
    return newElement
}