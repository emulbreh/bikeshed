import {Component} from './framework/Component'
import {List} from './List'
import {SearchForm} from './SearchForm'


class Picker extends Component{
    constructor(options){
        _.defaults(options, {
            cssClass: 'pldm-picker'
        })
        super.constructor(options);
        this.searchForm = new SearchForm({});
        this.$element.append(this.searchForm.$element);
        this.searchForm.on('change', this.onSearchChange.bind(this));
        this.searchForm.$input.on('keydown', this.onSearchInputKeyDown.bind(this));
        this.list = new List({
            render: function(item){
                var doc = item.data;
                return $(`<li><b>${doc.label}</b> ${doc.title}</li>`)
            }
        });
        this.$element.append(this.list.$element);
        this.list.on('select', this.onSelect.bind(this));
    }
    
    onSelect(doc){
        this.emit('select', doc);
    }

    onSearchInputKeyDown(e){
        switch(e.keyCode){
            case 13: // ENTER
                var doc = this.list.getSelection();
                if(doc){
                    this.onSelect(doc);
                    e.preventDefault();
                    return false;
                }
                break;
            case 38: // UP
                this.list.selectPreviousItem();
                e.preventDefault();
                return false;
            case 40: // DOWN
                this.list.selectNextItem();
                e.preventDefault();
                return false;
        }
    }

    onSearchChange(){
        var query = this.searchForm.query;
        this.list.load(`/api/documents/?q=${query}`);
    }
    
    set query(q){
        this.searchForm.query = q;
    }
    
    get query(){
        return this.searchForm.query;
    }
    
    focus(){
        this.searchForm.focus();
    }
}

export var Picker = Picker;
