import {PageWithSidebar} from './PageWithSidebar'
import {Document} from './Document'


class DocumentPage extends PageWithSidebar{
    constructor(options={}){
        super.constructor(options);
        this.resource = options.resource;
        this.$path = this.appendElement('<div class="path"/>');
        this.$header = this.appendElement('<h1/>');
    }
    
    onDocumentLoaded(doc){
        this.doc = doc;
        this.$header.html(`${doc.label}: ${doc.title}`);
        this.$path.empty();
        _.each(doc.path, (parent) => {
            this.$path.append(parent.createViewLink());
            this.$path.append($('<b> / </b>'));
        });
    }
    
    open(params){
        var done = null;
        if(params.uid){
            done = this.resource.fetch(params.uid).then((doc) => {
                this.onDocumentLoaded(doc);
            });
        }
        done = done ? done.then(() => super.open(params)) : super.open(params);
        return done;
    }
}

export var DocumentPage = DocumentPage;
