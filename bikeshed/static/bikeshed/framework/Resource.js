import {EventEmitter} from '../../EventEmitter'


class Resource extends EventEmitter{
    constructor(api, url, model, options){
        this.api = api;
        this.url = url;
        this.model = model;
    }
    
    request(options){
        console.log(options);
        return this.api.request(options.url || this.url, options);
    }
    
    get(options){
        options = _.defaults(options, {type: 'GET'});
        return this.request(options);
    }

    post(options){
        options = _.defaults({type: 'POST'});
        return this.request(options);
    }
    
    fetch(id, options){
        options = _.defaults(options || {}, {
            url: `${this.url}${id}/`
        });
        console.log('fetch', id, options);
        return this.get(options).then((data) => {
            return new this.model(data);
        });
    }

    save(model, options){
        options = options || {};
        if(model.url){
            options.url = model.url;
            options.absolute = true;
            options.type = 'PUT';
        }
        else{
            options.type = 'POST';
        }
        _.extend(options, model.serialize());
        return this.request(options).then((data) => {
            model.load(data);
            return model;
        });
    }

}

export var Resource = Resource;
