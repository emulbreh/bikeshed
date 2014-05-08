import {PageWithSidebar} from './PageWithSidebar'


class IndexPage extends PageWithSidebar{
    constructor(options){
        super.constructor(options);
        this.addToSidebar($('<a href="/new/">New</a>'));
        this.addToSidebar($('<a href="/search/">Search</a>'));
        this.addToSidebar($('<a href="/search/?q=Type:Project">Projects</a>'));
    }
    
}

export var IndexPage = IndexPage;
