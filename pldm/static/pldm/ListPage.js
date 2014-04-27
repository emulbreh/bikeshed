import {PageWithSidebar} from './PageWithSidebar'
import {Document} from './Document'
import {List} from './List'
import {SearchForm} from './SearchForm'


class ListPage extends PageWithSidebar{
    constructor(options){
        _.defaults(options, {
            cssClass: 'pldm-search'
        })
        super.constructor(options);
        this.searchForm = new SearchForm({});
        this.$element.append(this.searchForm.$element);
        this.searchForm.on('change', this.onSearchChange.bind(this));
        this.searchForm.$input.on('keydown', this.onSearchInputKeyDown.bind(this));
        this.list = new List({
            render: function(item){
                var doc = item.data;
                return $(`<li><a href="/view/${doc.uid}/">${doc.label}: ${doc.title}</a></li>`)
            }
        });
        this.$element.append(this.list.$element);
    }

    onSearchInputKeyDown(e){
        switch(e.keyCode){
            case 13: // ENTER
                var doc = this.list.getSelection();
                if(doc){
                    this.app.visit(`/view/${doc.uid}/`);
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

    open(params){
        if(params.q){
            this.searchForm.query = params.q;
        }
        else{
            this.onSearchChange();
        }
        return super.open(params).then(() => this.searchForm.focus());
    }
}

export var ListPage = ListPage;
