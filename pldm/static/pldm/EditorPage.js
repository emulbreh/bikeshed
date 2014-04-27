import {DocumentPage} from './DocumentPage'
import {Document} from './Document'
import {DocumentEditor} from './DocumentEditor'


class EditorPage extends DocumentPage{
    constructor(options){
        super.constructor(options);
        this.addToSidebar($('<a href="#save">Save</a>'));
        this.addToSidebar($('<a href="#cancel">Cancel</a>'));
        this.editor = new DocumentEditor({});
        this.$element.append(this.editor.$element);

        this.addActions({
            cancel: (e) => {
                if(this.doc.uid){
                    this.app.visit(`/view/${this.doc.uid}/`);
                }
                else{
                    this.app.visit('/');
                }
            },
            save: (e) => {
                this.editor.save().then((doc) => {
                    this.app.visit(`/view/${doc.uid}/`);
                });
            }
        });
    }
    
    onDocumentLoaded(doc){
        super.onDocumentLoaded(doc);
        this.editor.setDocument(doc);
    }
    
    open(params){
        return super.open(params).then((doc) => this.editor.focus());
    }
}

export var EditorPage = EditorPage;
