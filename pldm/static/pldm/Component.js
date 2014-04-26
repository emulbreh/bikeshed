import {EventEmitter} from '../EventEmitter'


class Component extends EventEmitter{
    constructor(options) {
        options = options || {};
        super.constructor();
        this.$element = $('<div class="pldm-component"></div>');
        if(options.cssClass){
            this.$element.addClass(options.cssClass);
        }
    }
    
    get element(){
        return this.$element.get(0);
    }
    
    hide(){
        this.$element.hide();
    }
    
    show(){
        this.$element.show();
    }
}


export var Component = Component;
