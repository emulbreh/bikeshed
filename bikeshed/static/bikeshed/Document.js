import {Model} from './framework/Model'


class Document extends Model{
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
    
    createViewLink(){
        var title = this.displayTitle;
        return $(`<a href="/view/${this.uid}/" title="${title}">${title}</a>`);
    }
    
    serialize(){
        return {
            data: this.text,
            contentType: 'text/plain'
        };
    }
}


export var Document = Document;
