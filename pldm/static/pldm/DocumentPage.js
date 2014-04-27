import {PageWithSidebar} from './PageWithSidebar'
import {Document} from './Document'


class DocumentPage extends PageWithSidebar{
    constructor(options){
        super.constructor(options);
        this.$path = this.appendElement('<div class="path"/>');
        this.$header = this.appendElement('<h1/>');
    }
    
    onLoadError(){
        console.log("error", arguments);
    }
    
    onDocumentLoaded(doc){
        console.log("document loaded", doc);
        this.doc = doc;
        this.$header.html(`${doc.label}: ${doc.title}`);
        this.$path.empty();
        _.each(doc.path, (parent) => {
            this.$path.append(parent.createViewLink());
            this.$path.append($('<b> / </b>'));
        });
    }
    
    open(params){
        var loaded = new Promise((resolve, reject) => {
            if(!params.uid){
                resolve();
                return;
            }
            $.ajax('/api/document/' + params.uid + '/', {
                type: 'GET',
                error: this.onLoadError.bind(this),
                success: (data) => {
                    var doc = new Document(data);
                    this.onDocumentLoaded(doc);
                    resolve();
                }
            });
        });
        return Promise.all([super.open(params), loaded]);
    }
}

export var DocumentPage = DocumentPage;
