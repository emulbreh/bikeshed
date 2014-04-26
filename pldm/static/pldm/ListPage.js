import {PageWithSidebar} from './PageWithSidebar'
import {Document} from './Document'
import {List} from './List'


class ListPage extends PageWithSidebar{
    constructor(options){
        _.defaults(options, {
            cssClass: 'pldm-search'
        })
        super.constructor(options);
        this.list = new List({
            render: function(item){
                var doc = item.data;
                return $(`<li><a href="/view/${doc.uid}/">${doc.label}: ${doc.title}</a></li>`)
            }
        });
        this.$element.append(this.list.$element);
    }
    
    open(params){
        this.list.load('/api/documents/');
        super.open(params);
    }
}

export var ListPage = ListPage;
