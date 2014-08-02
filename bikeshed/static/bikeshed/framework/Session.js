import {EventEmitter} from '../../EventEmitter'


export class Session extends EventEmitter{
    constructor(options={}){
        super.constructor();
        _.defaults(options, {
            key: 'bikeshed.session'
        });
        this.key = options.key;
        this.data = JSON.parse(localStorage[this.key] || '{}');
    }
    
    set(name, value){
        this.data[name] = value;
        localStorage[this.key] = JSON.stringify(this.data);
    }
    
    get(name){
        return this.data[name];
    }
}
