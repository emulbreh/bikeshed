import {PageWithSidebar} from './PageWithSidebar'


class IndexPage extends PageWithSidebar{
    constructor(options){
        super.constructor(options);
        this.addToSidebar($('<a href="/create/">Create</a>'));
        this.addToSidebar($('<a href="/list/">Search</a>'));
    }
    
}

export var IndexPage = IndexPage;
