import {EventEmitter} from '../../EventEmitter'

var ACTIONS_DATA_KEY = 'bikeshed-component-actions';


export class Component extends EventEmitter{
    constructor(options) {
        options = _.defaults(options || {}, {
            element: '<div class="bikeshed-component"/>'
        });
        super.constructor();
        this.$element = $(options.element);
        if(options.cssClass){
            this.$element.addClass(options.cssClass);
        }
        this.actions = null;
    }
    
    get app(){
        if(this.parent){
            return this.parent.app;
        }
        throw new Error("component isn't linked to any app");
    }
    
    appendElement(el){
        var $el = $(el);
        this.$element.append($el);
        return $el;
    }
    
    addComponent(component){
        if(_.isUndefined(this.children)){
            this.children = [];
        }
        component.parent = this;
        this.children.push(component);
    }
    
    removeComponent(component){
        _.remove(this.children, (child) => {
            return child === component;
        });
    }
    
    append(component){
        this.$element.append(component.$element);
        this.addComponent(component);
        return component;
    }
    
    onActionClick(name, e){
        this.actions[name].call(this, e);
    }
    
    addAction(name, handler){
        if(!this.actions){
            this.actions = {};
            this.$element.on('click', 'a', (function(e){
                var $link = $(e.target);
                if($link.prop('tagName') != 'A'){
                    $link = $link.parents('a');
                }
                var url = $link.attr('href');
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
        if(this.parent){
            this.parent.removeComponent(this);
        }
    }
}
