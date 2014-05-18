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
        this._text = _.isUndefined(data.text) ? null : data.text;
        this.url = data.url;
        this.html = data.html;
        this.title = data.title;
        this.path = _.map(data.path, (doc) => new Document(doc));
    }

    getHeader(key, defaultValue){
        var header = this.headers[key.toLowerCase()];
        return header ? header.value : defaultValue;
    }

    setHeader(key, value){
        var h = this.headers[key.toLowerCase()];
        if(!h){
            h = this.headers[key.toLowerCase()] = {};
        }
        h.value = value;
        this._text = null;
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

    generateText(){
        var lines = [];
        _.each(this.headers, (value, key) => {
            lines.push(`${key}: ${value.value}`);
        });
        lines.push('', this.body);
        return lines.join('\n');
    }

    setText(text){
        this._text = text;
    }

    get text(){
        if(this._text === null){
            this._text = this.generateText();
        }
        return this._text;
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
