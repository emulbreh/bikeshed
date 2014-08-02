import {EventEmitter} from '../EventEmitter'


export class Collection extends EventEmitter{
    constructor(items = []){
        this.items = items;
    }
    
}
