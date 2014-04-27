import {Component} from './Component'


class Popup extends Component{
    constructor(options) {
        _.defaults(options, {
            cssClass: 'pldm-popup',
            title: ''
        });
        super.constructor(options);
        this.appendElement(`<header><span>${options.title}</span><a href="#close">⨯</a></header>`);
        this.content = options.content;
        if(this.content){
            this.append(this.content);
        }
        
        this.addActions({
            close: () => {
                this.hide();
            }
        });
        
        this.$overlay = $('<div class="pldm-overlay"></div>');
        this.$overlay.append(this.$element);
        $('body').append(this.$overlay);
    }
    
    show(){
        super.show();
        this.$overlay.show();
    }
    
    hide(){
        this.$overlay.hide();
        super.hide();
    }
    
    dispose(){
        this.$overlay.remove();
    }
}

export var Popup = Popup;
