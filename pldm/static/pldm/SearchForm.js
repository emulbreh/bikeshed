import {Component} from './framework/Component'
import {Document} from './Document'


class SearchForm extends Component{
    constructor(options) {
        options = _.defaults(options, {
            cssClass: 'pldm-searchform'
        });
        super.constructor(options);
        this.$input = this.appendElement('<input type="text"/>');
        this.appendElement('<i class="fa fa-search" />');
        this.$input.on('keydown', this.onSearchInputChange.bind(this));
        this.typingTimeout = null;
        this.lastQuery = null;
    }

    onQueryChange(query){
        if(query !== this.lastQuery){
            this.emit('change');
            this.lastQuery = query;
        }
    }

    onSearchInputChange(e){
        if(this.typingTimeout){
            clearTimeout(this.typingTimeout);
            this.typingTimeout = null;
        }
        this.typingTimeout = setTimeout(() => {
            this.onQueryChange(this.query);
            this.typingTimeout = null;
        }, 333);
    }

    get query(){
        return this.$input.val();
    }

    set query(q){
        this.$input.val(q);
        this.onQueryChange(q);
    }

    focus(){
        this.$input.focus();
    }

}

export var SearchForm = SearchForm;
