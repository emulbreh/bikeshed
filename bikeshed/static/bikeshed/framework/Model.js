import {EventEmitter} from '../../EventEmitter'


export class Model extends EventEmitter{
    constructor(data, options={}){
        super.constructor();
        this.load(data);
    }
    
    load(data){
        
    }
    
    toJson(){
        return {};
    }
    
    serialize(){
        return {
            data: this.toJson(),
            contentType: 'application/json'
        };
    }

}
