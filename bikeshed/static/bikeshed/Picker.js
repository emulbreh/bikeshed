import {Component} from './framework/Component'
import {List} from './List'
import {SearchForm} from './SearchForm'


class Picker extends Component{
    constructor(options={}){
        _.defaults(options, {
            cssClass: 'bikeshed-picker'
        })
        super.constructor(options);
        this.resource = options.resource;
        this.searchForm = this.append(new SearchForm({}));
        this.searchForm.on('change', this.onSearchChange.bind(this));
        this.searchForm.$input.on('keydown', this.onSearchInputKeyDown.bind(this));
        this.list = this.append(new List({
            resource: this.resource,
            render: function(item){
                var doc = item.data;
                var type = doc.getHeader('Type', '');
                var label = doc.label[0] == '#' ? `${doc.label}:` : '';
                var title = label ? doc.title : doc.label;
                return $(`<li><b>${label} </b>${title}<span class="type">${type}</span></li>`)
            }
        }));
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
        this.list.load({
            data: {q: this.searchForm.query}
        });
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
