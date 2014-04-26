import {Component} from './Component'


class Container extends Component{
    constructor(options) {
        options = options || {};
        super.constructor(options);
    }
}


export var Component = Component;
