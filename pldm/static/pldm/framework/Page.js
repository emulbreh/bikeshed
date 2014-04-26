import {Component} from './Component'


class Page extends Component{
    constructor(options){
        options = _.defaults(options, {
            cssClass: 'pldm-page'
        });
        super.constructor(options);
        this.hide();
    }
    
    open(params){
        this.show();
    }
    
    close(){
        this.hide();
    }

}

export var Page = Page;
