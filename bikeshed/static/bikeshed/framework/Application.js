import {EventEmitter} from '../../EventEmitter'
import {Session} from './Session'
import {Window} from './Window'


export class Application extends EventEmitter{
    constructor(options={}){
        _.defaults(options, {
            element: 'body'
        });
        super.constructor(options);

        this.session = options.session || new Session({});
        this.root = new Window({element: options.element, app: this});
        this.pages = {};
        this.splash = options.splash;
        this.currentPage = null;
        this.helperA = document.createElement('a');
        $('body').on('click', 'a', this.onLinkClick.bind(this));
        $(window).on('popstate', this.onHistoryChange.bind(this));
        this.routes = [];
        this._loading = false;
        _.each(options.pages, function(page, path){
            this.addPage(path, page);
        }, this);
    }

    addPage(path, page){
        this.pages[path] = page;
        page.app = this;
        var params = ['__path__'];
        var pattern = path.replace(/:\w+/g, function(match){
            params.push(match.substring(1));
            return '([^/]+)';
        });
        var re = new RegExp(`^${pattern}$`);
        this.routes.push({re, params, page, path});
        this.root.addPage(page);
    }

    start(){
        this.visit(location.pathname + location.search).then(() => {
            if(this.splash){
                $(this.splash).remove();
            }
        });
    }

    get loading(){
        return this._loading;
    }

    set loading(load){
        this._loading = load;
        this.root.$element[load ? 'addClass' : 'removeClass']('loading');
    }

    onHistoryChange(){
        this.visit(location.pathname + location.search, false);
    }

    parsePath(url){
        // FIXME: try https://developer.mozilla.org/en-US/docs/Web/API/Window.URL
        this.helperA.href = url;
        var path = this.helperA.pathname
        var querystring = this.helperA.search;
        var params = {};
        if(querystring){
            querystring = querystring.substring(1);
            querystring.split('&').forEach((pair) => {
                var [key, value] = pair.split('=');
                params[decodeURIComponent(key)] = decodeURIComponent(value);
            });
        }
        return {path, params};
    }

    visit(url, pushstate){
        console.log("VISIT", url);
        var pathInfo = this.parsePath(url);
        if(pushstate !== false){
            history.pushState(pathInfo.params, null, url);
        }
        var path = pathInfo.path;
        var page = null, params = pathInfo.params;
        for(var route of this.routes){
            var match = route.re.exec(path);
            if(match){
                page = route.page;
                _.extend(params, _.zipObject(route.params, match));
                break;
            }
        }
        if(!page){
            throw new Error(`404: ${path}`);
        }
        if(this.currentPage !== page){
            if(this.currentPage){
                this.currentPage.close();
            }
            this.currentPage = page;
        }
        this.loading = true;
        return page.open(params).then(() => {
            this.loading = false;
        }).catch((error) => {
            console.log("failed to open page", error);
            page.close();
        });
    }

    onLinkClick(e){
        var $link = $(e.target);
        if($link.prop('tagName') != 'A'){
            $link = $link.parents('a');
        }
        var url = $link.attr('href');
        if(url.match(/:\/\//)){
            return true;
        }
        if(url == '#'){
            return false;
        }
        e.preventDefault();
        this.visit(url);
    }
}
