import {EventEmitter} from '../EventEmitter'


class Collection extends EventEmitter{
    constructor(options){
        this.factory = options.factory || _.identity;
        this.url = options.url;
    }
}

export var Collection = Collection;
