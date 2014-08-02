import {EventEmitter} from '../EventEmitter'


class Collection extends EventEmitter{
    constructor(items = []){
        this.items = items;
    }
    
}

export var Collection = Collection;
