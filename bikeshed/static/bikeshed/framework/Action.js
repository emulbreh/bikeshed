import {EventEmitter} from '../../EventEmitter'


export class Action extends EventEmitter{
    constructor(options) {
        this.perform = options.perform;
        this.keys = options.keys;
    }
}
