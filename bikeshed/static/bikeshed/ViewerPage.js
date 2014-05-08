import {DocumentPage} from './DocumentPage'
import {Document} from './Document'


class ViewerPage extends DocumentPage{
    constructor(options){
        super.constructor(options);
        this.$display = this.appendElement('<div class="document-display"/>');
        this.addToSidebar('<a href="#edit"><i class="fa fa-edit"/> Edit</a>');
        this.addToSidebar('<a href="#children"><i class="fa fa-level-down"/> Children</a>');
        this.addActions({
            edit: (e) => {
                this.app.visit(`/edit/${this.doc.uid}/`);
            },
            children: (e) => {
                this.app.visit(`/search/?q=Project:${this.doc.uid}%20OR%20Parent:${this.doc.uid}`);
            }
        });
    }
    
    onDocumentLoaded(doc){
        super.onDocumentLoaded(doc);
        this.$display.html(doc.html);
    }
}

export var ViewerPage = ViewerPage;
