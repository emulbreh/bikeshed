import {DocumentPage} from './DocumentPage'
import {Document} from './Document'


class ViewerPage extends DocumentPage{
    constructor(options){
        super.constructor(options);
        this.$display = this.appendElement('<div class="document-display"/>');
        this.addToSidebar('<a href="#edit">Edit</a>');
        this.addActions({
                edit: function(){
                    this.app.visit(`/edit/${this.doc.uid}/`);
                }
        });
    }
    
    onDocumentLoaded(doc){
        super.onDocumentLoaded(doc);
        this.$display.html(doc.html);
    }
}

export var ViewerPage = ViewerPage;
