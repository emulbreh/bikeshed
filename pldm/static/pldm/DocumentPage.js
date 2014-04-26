import {PageWithSidebar} from './PageWithSidebar'
import {Document} from './Document'


class DocumentPage extends PageWithSidebar{
    constructor(options){
        super.constructor(options);
        this.$header = this.appendElement('<h1/>');
    }
    
    onLoadError(){
        console.log("error", arguments);
    }
    
    onDocumentLoaded(doc){
        console.log("document loaded", doc);
        this.doc = doc;
        this.$header.html(`${doc.label}: ${doc.title}`);
    }
    
    open(params){
        $.ajax('/api/document/' + params.uid + '/', {
            type: 'GET',
            error: this.onLoadError.bind(this),
            success: (function(data){
                var doc = new Document(data);
                this.onDocumentLoaded(doc);
            }).bind(this)
        });
        super.open(params);
    }
}

export var DocumentPage = DocumentPage;
