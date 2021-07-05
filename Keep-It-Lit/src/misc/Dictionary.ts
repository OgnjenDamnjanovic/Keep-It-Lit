export type Dictionary<T>={[Key:string]:T}
export function getDictElements<T>(object:Dictionary<T>) {
    return Object.getOwnPropertyNames(object);
}
export function sameDictKeys<T>(dict1:Dictionary<T>,dict2:Dictionary<T>):boolean{
    
    return getDictElements(dict1).sort().join()==getDictElements(dict2).sort().join();
}