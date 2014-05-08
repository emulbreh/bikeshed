import {Component} from './Component'


class Page extends Component{
    constructor(options){
        options = _.defaults(options, {
            cssClass: 'bikeshed-page'
        });
        super.constructor(options);
        this.hide();
    }
    
    open(params){
        return new Promise((resolve, reject) => {
            this.show();
            resolve();
        });
    }
    
    close(){
        this.hide();
    }

}

export var Page = Page;
