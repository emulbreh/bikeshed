import {DocumentPage} from './DocumentPage'
import {Document} from './Document'
import {Card} from './Card'
import {BoardColumn} from './BoardColumn'


export class BoardPage extends DocumentPage{
    constructor(options={}){
        _.defaults(options, {
            cssClass: 'bikeshed-board bikeshed-page'
        });
        super.constructor(options);
        this.$columns = this.appendElement('<div class="columns"/>');
        var columns = [
            {label: 'Todo', status: 'Open'},
            {label: 'In Progress', status: 'InProgress'},
            {label: 'Done', status: 'Done'}
        ];
        this.columns = [];
        this.columnsByStatus = {};
        _.each(columns, (col) => {
            var column = new BoardColumn({
                board: this,
                status: col.status,
                title: col.label
            });
            this.columns.push(column);
            this.columnsByStatus[col.status] = column;
            this.$columns.append(column.$element);
            this.addComponent(column);
        });

        this.addActions({
            edit: (e) => {
                this.app.visit(`/edit/${this.doc.uid}/`);
            }
        });
        this.cardIndex = {};
    }

    getCard(uid){
        return this.cardIndex[uid];
    }

    onDocumentLoaded(doc){
        super.onDocumentLoaded(doc);
        _.each(doc.getHeader('Tickets'), (uid) => {
            this.resource.fetch(uid).then((doc) => {
                this.addDocument(doc);
            });
        });
    }

    addDocument(doc){
        var card = new Card({document: doc});
        var col = this.columnsByStatus[doc.getHeader('Status', 'Open')];
        this.cardIndex[doc.uid] = card;
        col.addCard(card);
        return card
    }

    open(params){
        _.each(this.columns, (col) => {
            col.clear();
        });
        return super.open(params);
    }

}
