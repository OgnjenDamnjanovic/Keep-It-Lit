export class InventoryItem<T>{
    item: T;
    quantity:number;
    constructor(item:T, quantity:number){
        this.item=item;
        this.quantity=quantity
    }
}