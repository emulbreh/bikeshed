import {Component} from './framework/Component'
import {Document} from './Document'


export class Card extends Component{
    constructor(options={}) {
        _.defaults(options, {
            cssClass: 'bikeshed-card'
        })
        super.constructor(options);
        this.document = options.document;

        this.$element.attr('draggable', 'true');
        this.$element.on('dragstart', (e) => {
            e.originalEvent.dataTransfer.setData("application/x-bikeshed-document", this.document.uid);
        });

        this.$title = this.appendElement(`<a class="title" href="/view/${this.document.uid}/"/>`);
        this.setTitle(this.document.displayTitle);
        if(this.document.getHeader('Status', 'Open') == 'Done'){
            this.$element.addClass('closed');
        }
        this.document.on('change', this.onDocumentChange.bind(this));
    }

    onDocumentChange(doc){
        this.setTitle(this.document.displayTitle);
    }

    setTitle(title){
        this.$title.html(title);
    }

}
