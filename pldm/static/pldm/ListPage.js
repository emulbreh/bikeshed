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
        this.list = new List({
            render: function(item){
                var doc = item.data;
                return $(`<li><a href="/view/${doc.uid}/">${doc.label}: ${doc.title}</a></li>`)
            }
        });
        this.$element.append(this.list.$element);
    }
    
    onSearchChange(){
        var query = this.searchForm.getQuery();
        this.list.load(`/api/documents/?q=${query}`);
    }
    
    open(params){
        var loaded = this.list.load('/api/documents/');
        return Promise.all([super.open(params), loaded]);
    }
}

export var ListPage = ListPage;
