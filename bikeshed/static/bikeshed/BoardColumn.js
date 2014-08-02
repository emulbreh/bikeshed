import {Component} from './framework/Component'
import {Document} from './Document'


export class BoardColumn extends Component{
    constructor(options={}) {
        _.defaults(options, {
            cssClass: 'column'
        });
        super.constructor(options);
        this.appendElement(`<div class="title">${options.title}</div>`);
        this.status = options.status;
        this.board = options.board;

        this.cards = [];
        this.$element.on('dragenter', this.onDragEnter.bind(this));
        this.$element.on('dragover', this.onDragOver.bind(this));
        this.$element.on('dragleave', this.onDragLeave.bind(this));
        this.$element.on('drop', this.onDrop.bind(this));
    }

    addCard(card){
        this.cards.push(card);
        this.append(card);
    }

    clear(){
        _.each(this.cards, (card) => {
            card.dispose();
        });
        this.cards = [];
    }

    onDragEnter(e){
        this.$element.addClass('drag-over');
        return false;
    }

    onDragLeave(e){
        this.$element.removeClass('drag-over');
        return false;
    }

    onDragOver(e){
        return false;
    }

    onDrop(e){
        this.$element.removeClass('drag-over');
        var uid = e.originalEvent.dataTransfer.getData("application/x-bikeshed-document");
        var card = this.board.getCard(uid);
        card.document.setHeader('Status', this.status);
        this.board.resource.save(card.document);
        this.addCard(card);
        return false;
    }
}
