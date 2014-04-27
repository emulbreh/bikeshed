import {Component} from './Component'


class Popup extends Component{
    constructor(options) {
        _.defaults(options, {
            cssClass: 'pldm-popup',
            title: '',
            autodispose: true
        });
        super.constructor(options);
        this.appendElement(`<header><span>${options.title}</span><a href="#close">⨯</a></header>`);
        this.autodispose = options.autodispose;
        this.content = options.content;
        if(this.content){
            this.append(this.content);
        }

        this.addActions({
            close: this.close.bind(this)
        });

        this.$overlay = $('<div class="pldm-overlay"></div>');
        this.$overlay.append(this.$element);
        $('body').append(this.$overlay);
        this.$element.on('keydown', (e) => {
            if(e.keyCode == 27){
                this.close();
            }
        });
    }

    show(){
        super.show();
        this.$overlay.show();
    }

    hide(){
        this.$overlay.hide();
        super.hide();
    }

    close(){
        if(this.autodispose){
            this.dispose();
        }
        else{
            this.hide();
        }
    }

    dispose(){
        this.hide();
        this.$overlay.remove();
        this.emit('dispose');
    }
}

export var Popup = Popup;
