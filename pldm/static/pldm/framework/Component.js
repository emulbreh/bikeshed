import {EventEmitter} from '../../EventEmitter'

var ACTIONS_DATA_KEY = 'pldm-component-actions';


class Component extends EventEmitter{
    constructor(options) {
        options = options || {};
        super.constructor();
        this.$element = $('<div class="pldm-component"></div>');
        if(options.cssClass){
            this.$element.addClass(options.cssClass);
        }
        this.actions = null;
    }
    
    appendElement(el){
        var $el = $(el);
        this.$element.append($el);
        return $el;
    }
    
    append(component){
        this.$element.append(component.$element);
        return component;
    }
    
    onActionClick(name, e){
        this.actions[name].call(this, e);
    }
    
    addAction(name, handler){
        if(!this.actions){
            this.actions = {};
            this.$element.on('click', 'a', (function(e){
                var url = $(e.target).attr('href');
                if(url && url[0] == '#'){
                    var action = url.substring(1);
                    this.onActionClick(action, e);
                    return false;
                }
            }).bind(this));
        }
        this.actions[name] = handler;
    }
    
    addActions(mapping){
        _.each(mapping, (handler, name) => this.addAction(name, handler));
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
    
    dispose(){
        this.$element.remove();
    }
}


export var Component = Component;
