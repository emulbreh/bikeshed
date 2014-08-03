import {DocumentPage} from './DocumentPage'
import {Document} from './Document'
import {DocumentEditor} from './editor/DocumentEditor'
import {Completer} from './editor/Completer'
import {Action} from './framework/Action'


export class EditorPage extends DocumentPage{
    constructor(options={}){
        super.constructor(options);
        this.addToSidebar($('<a href="#save"><i class="fa fa-check"/>Save</a>'));
        this.addToSidebar($('<a href="#cancel"><i class="fa fa-times"/>Cancel</a>'));
        this.editor = new DocumentEditor({
            resource: this.resource
        });
        this.$element.append(this.editor.$element);

        this.addActions({
            cancel: new Action({
                keys: 'ctrl+c',
                perform: (e) => {
                    if(this.doc.uid){
                        this.app.visit(`/view/${this.doc.uid}/`);
                    }
                    else{
                        this.app.visit('/');
                    }
                }
            }),
            save: new Action({
                keys: 'ctrl+s',
                perform: () => {
                    this.editor.save();
                }
            })
        });

        this.editor.on('save', (doc) => {
            this.resource.save(doc).then((doc) => {
                this.app.visit(`/view/${doc.uid}/`);
            });
        });

        this.completer = new Completer({
            editor: this.editor.editor,
            resource: this.resource
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
