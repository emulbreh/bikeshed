import {Component} from './framework/Component'
import {Document} from './Document'

var ITEM_INDEX_DATA_KEY = 'bikeshed-list-item-index';


class List extends Component{
    constructor(options={}) {
        _.defaults(options, {
            cssClass: 'bikeshed-list'
        });
        super.constructor(options);
        this.resource = options.resource;
        this.$container = this.appendElement('<ul>');
        this.$container.on('click', this.onClick.bind(this));
        this.items = [];
        this.selectedItem = null;
        if(options.render){
            this.render = options.render;
        }
    }
    
    get selectedIndex() {
        return this.selectedItem ? this.selectedItem.index : -1;
    }
    
    render(item){
        return $(`<li>${item.data.label}</li>`);
    }

    onClick(e){
        var $el = $(e.target);
        if($el.length == 0){
            return;
        }
        var index = $el.data(ITEM_INDEX_DATA_KEY);
        this.select(index);
        this.emit('select', this.selectedItem.data);
    }

    appendItem(data){
        var item = {
            data: data,
            index: this.items.length
        };
        var $itemElement = this.render(item);
        item.$element = $itemElement;
        $itemElement.data(ITEM_INDEX_DATA_KEY, item.index);
        this.$container.append($itemElement);
        this.items.push(item);
    }
    
    getSelection(){
        return this.selectedItem ? this.selectedItem.data : null;
    }

    clear(){
        this.$container.empty();
        this.items = [];
        this.selectedItem = null;
    }

    load(options){
        return this.resource.get(options).then((result) => {
            this.onLoadSuccess(result);
        }).catch(() => {
            this.onLoadError.apply(this, arguments);
        });
    }
    
    onLoadError(){
        console.log('error getting items', arguments);
    }

    onLoadSuccess(result){
        this.clear();
        for(var data of result.documents){
            this.appendItem(new Document(data));
        }
        if(result.length == 1){
            this.select(0);
        }
    }

    select(index){
        index = index % this.items.length;
        if(this.selectedItem){
            this.selectedItem.$element.removeClass('selected');
        }
        if(index == -1){
            this.selectedItem = null;
            return;
        }
        this.selectedItem = this.items[index];
        this.selectedItem.$element.addClass('selected');
    }

    deselect(){
        this.select(-1);
    }

    selectNextItem(){
        this.select(this.selectedIndex + 1);
    }

    selectPreviousItem(){
        if(this.selectedItem){
            this.select(this.selectedIndex - 1 + this.items.length);
        }
        else{
            this.select(this.items.length - 1);
        }
    }
}

export var List = List;
