import {Page} from './framework/Page'


class PageWithSidebar extends Page{
    constructor(options){
        super.constructor(options);
        this.$sidebar = this.appendElement('<div class="bikeshed-sidebar"/>');
    }
    
    addToSidebar(el){
        this.$sidebar.append(el);
    }
}

export var PageWithSidebar = PageWithSidebar;
