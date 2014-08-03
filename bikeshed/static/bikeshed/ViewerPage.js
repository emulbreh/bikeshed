import {DocumentPage} from './DocumentPage'
import {Document} from './Document'
import {Action} from './framework/Action'


export class ViewerPage extends DocumentPage{
    constructor(options={}){
        options.shortcuts = [
            {keys: 'alt+e', action: 'edit'}
        ];
        super.constructor(options);
        this.$display = this.appendElement('<div class="document-display"/>');
        this.addToSidebar('<a href="#edit"><i class="fa fa-edit"/> Edit</a>');
        this.addToSidebar('<a href="#children"><i class="fa fa-level-down"/> Children</a>');
        this.addToSidebar('<a href="#board"><i class="fa fa-th"/> Board</a>');

        this.addActions({
            board: new Action({
                perform(e) {
                    this.app.visit(`/board/${this.doc.uid}/`);
                }
            }),
            edit: new Action({
                keys: 'ctrl+e',
                perform: (e) => {
                    this.app.visit(`/edit/${this.doc.uid}/`);
                }
            }),
            children: new Action({
                perform(e) {
                    this.app.visit(`/search/?q=Project:${this.doc.uid}%20OR%20Parent:${this.doc.uid}`);
                }
            })
        });
    }
    
    onDocumentLoaded(doc){
        super.onDocumentLoaded(doc);
        this.$display.html(doc.html);
    }
}
