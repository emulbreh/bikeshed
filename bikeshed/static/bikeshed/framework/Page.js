import {Component} from './Component'


export class Page extends Component{
    constructor(options={}){
        _.defaults(options, {
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
