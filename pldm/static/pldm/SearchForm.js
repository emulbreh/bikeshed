import {Component} from './framework/Component'
import {Document} from './Document'


class SearchForm extends Component{
    constructor(options) {
        options = _.defaults(options, {
            cssClass: 'pldm-searchform'
        });
        super.constructor(options);
        this.$input = this.appendElement('<input type="text"/>');
        this.$input.on('keydown', this.onSearchInputChange.bind(this));
        this.typingTimeout = null;
        this.lastQuery = null;
    }
    
    onSearchInputChange(){
        if(this.typingTimeout){
            clearTimeout(this.typingTimeout);
            this.typingTimeout = null;
        }
        this.typingTimeout = setTimeout(() => {
            var query = this.getQuery();
            if(query !== this.lastQuery){
                this.emit('change');
                this.lastQuery = query;
            }
            this.typingTimeout = null;
        }, 333);
    }
    
    getQuery(){
        return this.$input.val();
    }

}

export var SearchForm = SearchForm;
