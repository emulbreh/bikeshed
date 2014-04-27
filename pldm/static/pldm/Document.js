import {Collection} from './Collection'


class Document{

    constructor(data, options) {
        this.collection = options && options.collection;
        this.load(data);
    }
    
    load(data){
        this.headers = {};
        if(data.headers){
            for(var attr of data.headers){
                this.headers[attr.key.toLowerCase()] = attr;
            }
        }
        this.uid = data.uid;
        this.body = data.body || '';
        this._label = data.label;
        this.text = data.text || '';
        this.url = data.url;
        this.html = data.html;
        this.title = data.title;
        this.path = _.map(data.path, (doc) => new Document(doc));
    }
    
    getHeader(key, defaultValue){
        var header = this.headers[key.toLowerCase()];
        return header ? header.value : defaultValue;
    }
    
    get number(){
        return this.getHeader('number');
    }
    
    get label(){
        return this._label || `#${this.number}: ${this.getHeader('summary')}`
    }

    get displayTitle(){
        if(this.label[0] == '#'){
            return `${this.label}: ${this.title}`;
        }
        return this.label;
    }

    setText(text){
        this.text = text;
    }
    
    get collectionUrl(){
        var collection = this.collection || this.constructor.collection;
        if(collection){
            return collection.url;
        }
        return null;
    }
    
    save(){
        var url = this.url || this.collectionUrl;
        if(!url){
            throw new Error("cannot create object outside of collection");
        }
        return new Promise((resolve, reject) => {
            $.ajax(url, {
                type: this.url ? 'PUT' : 'POST',
                dataType: 'json',
                contentType: 'text/plain',
                data: this.text,
                success: (data) => {
                    this.load(data);
                    resolve(this);
                },
                error: reject
            });
        });
    }
    
    createViewLink(){
        var title = this.displayTitle;
        return $(`<a href="/view/${this.uid}/" title="${title}">${title}</a>`);
    }
}


var documentCollection = new Collection({
    factory: Document,
    url: '/api/documents/'
});

Document.collection = documentCollection;

export var Document = Document;
export var documentCollection = documentCollection;
