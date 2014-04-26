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
        this.body = data.body || '';
        this._label = data.label;
        this.text = data.text || '';
        this.url = data.url;
    }
    
    getHeader(key){
        var header = this.headers[key.toLowerCase()];
        return header ? header.value : null;
    }
    
    get number(){
        return this.getHeader('number');
    }
    
    get label(){
        return this._label || `#${this.number}: ${this.getHeader('summary')}`
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
        $.ajax(url, {
            type: this.url ? 'PUT' : 'POST',
            dataType: 'json',
            contentType: 'text/plain',
            data: this.text,
            success: this.load.bind(this),
            error: console.log
        });
    }
}


var documentCollection = new Collection({
    factory: Document,
    url: '/api/documents/'
});

Document.collection = documentCollection;

export var Document = Document;
export var documentCollection = documentCollection;
