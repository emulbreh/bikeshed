import {PageWithSidebar} from './PageWithSidebar'
import {Picker} from './Picker'


class ListPage extends PageWithSidebar{
    constructor(options){
        _.defaults(options, {
            cssClass: 'bikeshed-search'
        });
        super.constructor(options);
        this.resource = options.resource;
        this.picker = this.append(new Picker({resource: this.resource}));
        this.picker.on('select', (doc) => {
            this.app.visit(`/view/${doc.uid}/`);
        });
    }

    open(params){
        this.picker.query = params.q || '';
        return super.open(params).then(() => this.picker.focus());
    }
}

export var ListPage = ListPage;
