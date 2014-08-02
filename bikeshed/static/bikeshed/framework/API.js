import {EventEmitter} from '../../EventEmitter'


class API extends EventEmitter{
    constructor(options={}) {
        super.constructor();
        _.defaults(options, {
            baseUrl: '',
            defaultContentType: 'application/json',
            defaultHeaders: {}
        });
        this.baseUrl = options.baseUrl;
        this.defaultContentType = options.defaultContentType;
        this.defaultHeaders = options.defaultHeaders;
    }
    
    setDefaultHeader(name, value){
        this.defaultHeaders[name] = value;
    }
    
    removeDefaultHeader(name){
        delete this.defaultHeaders[name];
    }
    
    request(url, options={}){
        if(!options.absolute){
            url = this.baseUrl + url;
        }
        _.defaults(options, {
            contentType: this.defaultContentType,
            dataType: 'json',
            headers: {}
        });
        _.extend(options.headers, this.defaultHeaders);
        console.log("API.request", url, options.headers);
        return new Promise((resolve, reject) => {
            options.success = resolve;
            options.error = (xhr, status, error) => {
                if(xhr.status == 401){
                    this.emit('unauthorizedRequest', xhr);
                }
                else{
                    console.log("ERROR", status, error, xhr);
                }
                reject();
            };
            $.ajax(url, options);
        });
    }
    
    post(url, options={}){
        _.defaults(options, {
            type: 'POST'
        });
        return this.request(url, options);
    }
}


export var API = API;
