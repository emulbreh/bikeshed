import {Component} from './Component'


class Page extends Component{
    constructor(options){
        options = _.defaults(options, {
            cssClass: 'bikeshed-page'
        });
        super.constructor(options);
        this.hide();
    }
    
    set app(a){
        this._app = a;
    }
    
    get app(){
        return this._app;
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
