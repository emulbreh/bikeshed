System.register("../bikeshed/static/EventEmitter", [], function() {
  "use strict";
  var __moduleName = "../bikeshed/static/EventEmitter";
  (function() {
    'use strict';
    function EventEmitter() {}
    var proto = EventEmitter.prototype;
    var exports = this;
    var originalGlobalValue = exports.EventEmitter;
    function indexOfListener(listeners, listener) {
      var i = listeners.length;
      while (i--) {
        if (listeners[i].listener === listener) {
          return i;
        }
      }
      return -1;
    }
    function alias(name) {
      return function aliasClosure() {
        return this[name].apply(this, arguments);
      };
    }
    proto.getListeners = function getListeners(evt) {
      var events = this._getEvents();
      var response;
      var key;
      if (evt instanceof RegExp) {
        response = {};
        for (key in events) {
          if (events.hasOwnProperty(key) && evt.test(key)) {
            response[key] = events[key];
          }
        }
      } else {
        response = events[evt] || (events[evt] = []);
      }
      return response;
    };
    proto.flattenListeners = function flattenListeners(listeners) {
      var flatListeners = [];
      var i;
      for (i = 0; i < listeners.length; i += 1) {
        flatListeners.push(listeners[i].listener);
      }
      return flatListeners;
    };
    proto.getListenersAsObject = function getListenersAsObject(evt) {
      var listeners = this.getListeners(evt);
      var response;
      if (listeners instanceof Array) {
        response = {};
        response[evt] = listeners;
      }
      return response || listeners;
    };
    proto.addListener = function addListener(evt, listener) {
      var listeners = this.getListenersAsObject(evt);
      var listenerIsWrapped = typeof listener === 'object';
      var key;
      for (key in listeners) {
        if (listeners.hasOwnProperty(key) && indexOfListener(listeners[key], listener) === -1) {
          listeners[key].push(listenerIsWrapped ? listener : {
            listener: listener,
            once: false
          });
        }
      }
      return this;
    };
    proto.on = alias('addListener');
    proto.addOnceListener = function addOnceListener(evt, listener) {
      return this.addListener(evt, {
        listener: listener,
        once: true
      });
    };
    proto.once = alias('addOnceListener');
    proto.defineEvent = function defineEvent(evt) {
      this.getListeners(evt);
      return this;
    };
    proto.defineEvents = function defineEvents(evts) {
      for (var i = 0; i < evts.length; i += 1) {
        this.defineEvent(evts[i]);
      }
      return this;
    };
    proto.removeListener = function removeListener(evt, listener) {
      var listeners = this.getListenersAsObject(evt);
      var index;
      var key;
      for (key in listeners) {
        if (listeners.hasOwnProperty(key)) {
          index = indexOfListener(listeners[key], listener);
          if (index !== -1) {
            listeners[key].splice(index, 1);
          }
        }
      }
      return this;
    };
    proto.off = alias('removeListener');
    proto.addListeners = function addListeners(evt, listeners) {
      return this.manipulateListeners(false, evt, listeners);
    };
    proto.removeListeners = function removeListeners(evt, listeners) {
      return this.manipulateListeners(true, evt, listeners);
    };
    proto.manipulateListeners = function manipulateListeners(remove, evt, listeners) {
      var i;
      var value;
      var single = remove ? this.removeListener : this.addListener;
      var multiple = remove ? this.removeListeners : this.addListeners;
      if (typeof evt === 'object' && !(evt instanceof RegExp)) {
        for (i in evt) {
          if (evt.hasOwnProperty(i) && (value = evt[i])) {
            if (typeof value === 'function') {
              single.call(this, i, value);
            } else {
              multiple.call(this, i, value);
            }
          }
        }
      } else {
        i = listeners.length;
        while (i--) {
          single.call(this, evt, listeners[i]);
        }
      }
      return this;
    };
    proto.removeEvent = function removeEvent(evt) {
      var type = typeof evt;
      var events = this._getEvents();
      var key;
      if (type === 'string') {
        delete events[evt];
      } else if (evt instanceof RegExp) {
        for (key in events) {
          if (events.hasOwnProperty(key) && evt.test(key)) {
            delete events[key];
          }
        }
      } else {
        delete this._events;
      }
      return this;
    };
    proto.removeAllListeners = alias('removeEvent');
    proto.emitEvent = function emitEvent(evt, args) {
      var listeners = this.getListenersAsObject(evt);
      var listener;
      var i;
      var key;
      var response;
      for (key in listeners) {
        if (listeners.hasOwnProperty(key)) {
          i = listeners[key].length;
          while (i--) {
            listener = listeners[key][i];
            if (listener.once === true) {
              this.removeListener(evt, listener.listener);
            }
            response = listener.listener.apply(this, args || []);
            if (response === this._getOnceReturnValue()) {
              this.removeListener(evt, listener.listener);
            }
          }
        }
      }
      return this;
    };
    proto.trigger = alias('emitEvent');
    proto.emit = function emit(evt) {
      var args = Array.prototype.slice.call(arguments, 1);
      return this.emitEvent(evt, args);
    };
    proto.setOnceReturnValue = function setOnceReturnValue(value) {
      this._onceReturnValue = value;
      return this;
    };
    proto._getOnceReturnValue = function _getOnceReturnValue() {
      if (this.hasOwnProperty('_onceReturnValue')) {
        return this._onceReturnValue;
      } else {
        return true;
      }
    };
    proto._getEvents = function _getEvents() {
      return this._events || (this._events = {});
    };
    EventEmitter.noConflict = function noConflict() {
      exports.EventEmitter = originalGlobalValue;
      return EventEmitter;
    };
    if (typeof define === 'function' && define.amd) {
      define(function() {
        return EventEmitter;
      });
    } else if (typeof module === 'object' && module.exports) {
      module.exports = EventEmitter;
    } else {
      this.EventEmitter = EventEmitter;
    }
  }.call(this));
  var EventEmitter = this.EventEmitter;
  return {get EventEmitter() {
      return EventEmitter;
    }};
});
System.register("../bikeshed/static/bikeshed/framework/Model", [], function() {
  "use strict";
  var __moduleName = "../bikeshed/static/bikeshed/framework/Model";
  var EventEmitter = $traceurRuntime.assertObject(System.get("../bikeshed/static/EventEmitter")).EventEmitter;
  var Model = function Model(data) {
    var options = arguments[1] !== (void 0) ? arguments[1] : {};
    $traceurRuntime.superCall(this, $Model.prototype, "constructor", []);
    this.load(data);
  };
  var $Model = Model;
  ($traceurRuntime.createClass)(Model, {
    load: function(data) {},
    toJson: function() {
      return {};
    },
    serialize: function() {
      return {
        data: this.toJson(),
        contentType: 'application/json'
      };
    }
  }, {}, EventEmitter);
  return {get Model() {
      return Model;
    }};
});
System.register("../bikeshed/static/bikeshed/Document", [], function() {
  "use strict";
  var __moduleName = "../bikeshed/static/bikeshed/Document";
  var Model = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/framework/Model")).Model;
  var Document = function Document() {
    $traceurRuntime.defaultSuperCall(this, $Document.prototype, arguments);
  };
  var $Document = Document;
  ($traceurRuntime.createClass)(Document, {
    load: function(data) {
      this.headers = {};
      if (data.headers) {
        for (var $__3 = data.headers[Symbol.iterator](),
            $__4; !($__4 = $__3.next()).done; ) {
          var attr = $__4.value;
          {
            this.headers[attr.key.toLowerCase()] = attr;
          }
        }
      }
      this.uid = data.uid;
      this.body = data.body || '';
      this._label = data.label;
      this._text = _.isUndefined(data.text) ? null : data.text;
      this.url = data.url;
      this.html = data.html;
      this.title = data.title;
      this.path = _.map(data.path, (function(doc) {
        return new $Document(doc);
      }));
    },
    getHeader: function(key, defaultValue) {
      var header = this.headers[key.toLowerCase()];
      return header ? header.value : defaultValue;
    },
    setHeader: function(key, value) {
      var h = this.headers[key.toLowerCase()];
      if (!h) {
        h = this.headers[key.toLowerCase()] = {};
      }
      h.value = value;
      this._text = null;
    },
    get number() {
      return this.getHeader('number');
    },
    get label() {
      return this._label || ("#" + this.number + ": " + this.getHeader('summary'));
    },
    get displayTitle() {
      if (this.label[0] == '#') {
        return (this.label + ": " + this.title);
      }
      return this.label;
    },
    generateText: function() {
      var lines = [];
      _.each(this.headers, (function(value, key) {
        lines.push((key + ": " + value.value));
      }));
      lines.push('', this.body);
      return lines.join('\n');
    },
    setText: function(text) {
      this._text = text;
    },
    get text() {
      if (this._text === null) {
        this._text = this.generateText();
      }
      return this._text;
    },
    createViewLink: function() {
      var title = this.displayTitle;
      return $(("<a href=\"/view/" + this.uid + "/\" title=\"" + title + "\">" + title + "</a>"));
    },
    serialize: function() {
      return {
        data: this.text,
        contentType: 'text/plain'
      };
    }
  }, {}, Model);
  return {get Document() {
      return Document;
    }};
});
System.register("../bikeshed/static/bikeshed/framework/Component", [], function() {
  "use strict";
  var __moduleName = "../bikeshed/static/bikeshed/framework/Component";
  var EventEmitter = $traceurRuntime.assertObject(System.get("../bikeshed/static/EventEmitter")).EventEmitter;
  var ACTIONS_DATA_KEY = 'bikeshed-component-actions';
  var Component = function Component(options) {
    options = _.defaults(options || {}, {element: '<div class="bikeshed-component"/>'});
    $traceurRuntime.superCall(this, $Component.prototype, "constructor", []);
    this.$element = $(options.element);
    if (options.cssClass) {
      this.$element.addClass(options.cssClass);
    }
    this.actions = null;
  };
  var $Component = Component;
  ($traceurRuntime.createClass)(Component, {
    get app() {
      if (this.parent) {
        return this.parent.app;
      }
      throw new Error("component isn't linked to any app");
    },
    appendElement: function(el) {
      var $el = $(el);
      this.$element.append($el);
      return $el;
    },
    addComponent: function(component) {
      if (_.isUndefined(this.children)) {
        this.children = [];
      }
      component.parent = this;
      this.children.push(component);
    },
    removeComponent: function(component) {
      _.remove(this.children, (function(child) {
        return child === component;
      }));
    },
    append: function(component) {
      this.$element.append(component.$element);
      this.addComponent(component);
      return component;
    },
    onActionClick: function(name, e) {
      this.actions[name].call(this, e);
    },
    addAction: function(name, handler) {
      if (!this.actions) {
        this.actions = {};
        this.$element.on('click', 'a', (function(e) {
          var $link = $(e.target);
          if ($link.prop('tagName') != 'A') {
            $link = $link.parents('a');
          }
          var url = $link.attr('href');
          if (url && url[0] == '#') {
            var action = url.substring(1);
            this.onActionClick(action, e);
            return false;
          }
        }).bind(this));
      }
      this.actions[name] = handler;
    },
    addActions: function(mapping) {
      var $__6 = this;
      _.each(mapping, (function(handler, name) {
        return $__6.addAction(name, handler);
      }));
    },
    get element() {
      return this.$element.get(0);
    },
    hide: function() {
      this.$element.hide();
    },
    show: function() {
      this.$element.show();
    },
    dispose: function() {
      this.$element.remove();
      if (this.parent) {
        this.parent.removeComponent(this);
      }
    }
  }, {}, EventEmitter);
  return {get Component() {
      return Component;
    }};
});
System.register("../bikeshed/static/bikeshed/BoardColumn", [], function() {
  "use strict";
  var __moduleName = "../bikeshed/static/bikeshed/BoardColumn";
  var Component = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/framework/Component")).Component;
  var Document = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/Document")).Document;
  var BoardColumn = function BoardColumn() {
    var options = arguments[0] !== (void 0) ? arguments[0] : {};
    _.defaults(options, {cssClass: 'column'});
    $traceurRuntime.superCall(this, $BoardColumn.prototype, "constructor", [options]);
    this.appendElement(("<div class=\"title\">" + options.title + "</div>"));
    this.status = options.status;
    this.board = options.board;
    this.cards = [];
    this.$element.on('dragenter', this.onDragEnter.bind(this));
    this.$element.on('dragover', this.onDragOver.bind(this));
    this.$element.on('dragleave', this.onDragLeave.bind(this));
    this.$element.on('drop', this.onDrop.bind(this));
  };
  var $BoardColumn = BoardColumn;
  ($traceurRuntime.createClass)(BoardColumn, {
    addCard: function(card) {
      this.cards.push(card);
      this.append(card);
    },
    clear: function() {
      _.each(this.cards, (function(card) {
        card.dispose();
      }));
      this.cards = [];
    },
    onDragEnter: function(e) {
      this.$element.addClass('drag-over');
      return false;
    },
    onDragLeave: function(e) {
      this.$element.removeClass('drag-over');
      return false;
    },
    onDragOver: function(e) {
      return false;
    },
    onDrop: function(e) {
      this.$element.removeClass('drag-over');
      var uid = e.originalEvent.dataTransfer.getData("application/x-bikeshed-document");
      var card = this.board.getCard(uid);
      card.document.setHeader('Status', this.status);
      this.board.resource.save(card.document);
      this.addCard(card);
      return false;
    }
  }, {}, Component);
  return {get BoardColumn() {
      return BoardColumn;
    }};
});
System.register("../bikeshed/static/bikeshed/Card", [], function() {
  "use strict";
  var __moduleName = "../bikeshed/static/bikeshed/Card";
  var Component = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/framework/Component")).Component;
  var Document = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/Document")).Document;
  var Card = function Card() {
    var options = arguments[0] !== (void 0) ? arguments[0] : {};
    var $__11 = this;
    _.defaults(options, {cssClass: 'bikeshed-card'});
    $traceurRuntime.superCall(this, $Card.prototype, "constructor", [options]);
    this.document = options.document;
    this.$element.attr('draggable', 'true');
    this.$element.on('dragstart', (function(e) {
      e.originalEvent.dataTransfer.setData("application/x-bikeshed-document", $__11.document.uid);
    }));
    this.$title = this.appendElement(("<a class=\"title\" href=\"/view/" + this.document.uid + "/\"/>"));
    this.setTitle(this.document.displayTitle);
    if (this.document.getHeader('Status', 'Open') == 'Done') {
      this.$element.addClass('closed');
    }
    this.document.on('change', this.onDocumentChange.bind(this));
  };
  var $Card = Card;
  ($traceurRuntime.createClass)(Card, {
    onDocumentChange: function(doc) {
      this.setTitle(this.document.displayTitle);
    },
    setTitle: function(title) {
      this.$title.html(title);
    }
  }, {}, Component);
  return {get Card() {
      return Card;
    }};
});
System.register("../bikeshed/static/bikeshed/framework/Page", [], function() {
  "use strict";
  var __moduleName = "../bikeshed/static/bikeshed/framework/Page";
  var Component = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/framework/Component")).Component;
  var Page = function Page() {
    var options = arguments[0] !== (void 0) ? arguments[0] : {};
    _.defaults(options, {cssClass: 'bikeshed-page'});
    $traceurRuntime.superCall(this, $Page.prototype, "constructor", [options]);
    this.hide();
  };
  var $Page = Page;
  ($traceurRuntime.createClass)(Page, {
    set app(a) {
      this._app = a;
    },
    get app() {
      return this._app;
    },
    open: function(params) {
      var $__14 = this;
      return new Promise((function(resolve, reject) {
        $__14.show();
        resolve();
      }));
    },
    close: function() {
      this.hide();
    }
  }, {}, Component);
  return {get Page() {
      return Page;
    }};
});
System.register("../bikeshed/static/bikeshed/PageWithSidebar", [], function() {
  "use strict";
  var __moduleName = "../bikeshed/static/bikeshed/PageWithSidebar";
  var Page = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/framework/Page")).Page;
  var PageWithSidebar = function PageWithSidebar() {
    var options = arguments[0] !== (void 0) ? arguments[0] : {};
    $traceurRuntime.superCall(this, $PageWithSidebar.prototype, "constructor", [options]);
    this.$sidebar = this.appendElement('<div class="bikeshed-sidebar"/>');
  };
  var $PageWithSidebar = PageWithSidebar;
  ($traceurRuntime.createClass)(PageWithSidebar, {addToSidebar: function(el) {
      this.$sidebar.append(el);
    }}, {}, Page);
  return {get PageWithSidebar() {
      return PageWithSidebar;
    }};
});
System.register("../bikeshed/static/bikeshed/DocumentPage", [], function() {
  "use strict";
  var __moduleName = "../bikeshed/static/bikeshed/DocumentPage";
  var PageWithSidebar = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/PageWithSidebar")).PageWithSidebar;
  var Document = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/Document")).Document;
  var DocumentPage = function DocumentPage() {
    var options = arguments[0] !== (void 0) ? arguments[0] : {};
    $traceurRuntime.superCall(this, $DocumentPage.prototype, "constructor", [options]);
    this.resource = options.resource;
    this.$path = this.appendElement('<div class="path"/>');
    this.$header = this.appendElement('<h1/>');
  };
  var $DocumentPage = DocumentPage;
  ($traceurRuntime.createClass)(DocumentPage, {
    onDocumentLoaded: function(doc) {
      var $__19 = this;
      this.doc = doc;
      this.$header.html((doc.label + ": " + doc.title));
      this.$path.empty();
      _.each(doc.path, (function(parent) {
        $__19.$path.append(parent.createViewLink());
        $__19.$path.append($('<b> / </b>'));
      }));
    },
    open: function(params) {
      var $__20 = this;
      var $__19 = this;
      var done = null;
      if (params.uid) {
        done = this.resource.fetch(params.uid).then((function(doc) {
          $__19.onDocumentLoaded(doc);
        }));
      }
      done = done ? done.then((function() {
        return $traceurRuntime.superCall($__20, $DocumentPage.prototype, "open", [params]);
      })) : $traceurRuntime.superCall(this, $DocumentPage.prototype, "open", [params]);
      return done;
    }
  }, {}, PageWithSidebar);
  return {get DocumentPage() {
      return DocumentPage;
    }};
});
System.register("../bikeshed/static/bikeshed/BoardPage", [], function() {
  "use strict";
  var __moduleName = "../bikeshed/static/bikeshed/BoardPage";
  var DocumentPage = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/DocumentPage")).DocumentPage;
  var Document = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/Document")).Document;
  var Card = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/Card")).Card;
  var BoardColumn = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/BoardColumn")).BoardColumn;
  var BoardPage = function BoardPage() {
    var options = arguments[0] !== (void 0) ? arguments[0] : {};
    var $__22 = this;
    _.defaults(options, {cssClass: 'bikeshed-board bikeshed-page'});
    $traceurRuntime.superCall(this, $BoardPage.prototype, "constructor", [options]);
    this.$columns = this.appendElement('<div class="columns"/>');
    var columns = [{
      label: 'Todo',
      status: 'Open'
    }, {
      label: 'In Progress',
      status: 'InProgress'
    }, {
      label: 'Done',
      status: 'Done'
    }];
    this.columns = [];
    this.columnsByStatus = {};
    _.each(columns, (function(col) {
      var column = new BoardColumn({
        board: $__22,
        status: col.status,
        title: col.label
      });
      $__22.columns.push(column);
      $__22.columnsByStatus[col.status] = column;
      $__22.$columns.append(column.$element);
      $__22.addComponent(column);
    }));
    this.addActions({edit: (function(e) {
        $__22.app.visit(("/edit/" + $__22.doc.uid + "/"));
      })});
    this.cardIndex = {};
  };
  var $BoardPage = BoardPage;
  ($traceurRuntime.createClass)(BoardPage, {
    getCard: function(uid) {
      return this.cardIndex[uid];
    },
    onDocumentLoaded: function(doc) {
      var $__22 = this;
      $traceurRuntime.superCall(this, $BoardPage.prototype, "onDocumentLoaded", [doc]);
      _.each(doc.getHeader('Tickets'), (function(uid) {
        $__22.resource.fetch(uid).then((function(doc) {
          $__22.addDocument(doc);
        }));
      }));
    },
    addDocument: function(doc) {
      var card = new Card({document: doc});
      var col = this.columnsByStatus[doc.getHeader('Status', 'Open')];
      this.cardIndex[doc.uid] = card;
      col.addCard(card);
      return card;
    },
    open: function(params) {
      _.each(this.columns, (function(col) {
        col.clear();
      }));
      return $traceurRuntime.superCall(this, $BoardPage.prototype, "open", [params]);
    }
  }, {}, DocumentPage);
  return {get BoardPage() {
      return BoardPage;
    }};
});
System.register("../bikeshed/static/bikeshed/Collection", [], function() {
  "use strict";
  var __moduleName = "../bikeshed/static/bikeshed/Collection";
  var EventEmitter = $traceurRuntime.assertObject(System.get("../bikeshed/static/EventEmitter")).EventEmitter;
  var Collection = function Collection() {
    var items = arguments[0] !== (void 0) ? arguments[0] : [];
    this.items = items;
  };
  ($traceurRuntime.createClass)(Collection, {}, {}, EventEmitter);
  return {get Collection() {
      return Collection;
    }};
});
System.register("../bikeshed/static/bikeshed/List", [], function() {
  "use strict";
  var __moduleName = "../bikeshed/static/bikeshed/List";
  var Component = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/framework/Component")).Component;
  var Document = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/Document")).Document;
  var ITEM_INDEX_DATA_KEY = 'bikeshed-list-item-index';
  var List = function List() {
    var options = arguments[0] !== (void 0) ? arguments[0] : {};
    _.defaults(options, {cssClass: 'bikeshed-list'});
    $traceurRuntime.superCall(this, $List.prototype, "constructor", [options]);
    this.resource = options.resource;
    this.$container = this.appendElement('<ul>');
    this.$container.on('click', this.onClick.bind(this));
    this.items = [];
    this.selectedItem = null;
    if (options.render) {
      this.render = options.render;
    }
  };
  var $List = List;
  ($traceurRuntime.createClass)(List, {
    get selectedIndex() {
      return this.selectedItem ? this.selectedItem.index : -1;
    },
    render: function(item) {
      return $(("<li>" + item.data.label + "</li>"));
    },
    onClick: function(e) {
      var $el = $(e.target);
      if ($el.length == 0) {
        return;
      }
      var index = $el.data(ITEM_INDEX_DATA_KEY);
      this.select(index);
      this.emit('select', this.selectedItem.data);
    },
    appendItem: function(data) {
      var item = {
        data: data,
        index: this.items.length
      };
      var $itemElement = this.render(item);
      item.$element = $itemElement;
      $itemElement.data(ITEM_INDEX_DATA_KEY, item.index);
      this.$container.append($itemElement);
      this.items.push(item);
    },
    getSelection: function() {
      return this.selectedItem ? this.selectedItem.data : null;
    },
    clear: function() {
      this.$container.empty();
      this.items = [];
      this.selectedItem = null;
    },
    load: function(options) {
      var $__27 = this,
          $__28 = arguments;
      return this.resource.get(options).then((function(result) {
        $__27.onLoadSuccess(result);
      })).catch((function() {
        $__27.onLoadError.apply($__27, $__28);
      }));
    },
    onLoadError: function() {
      console.log('error getting items', arguments);
    },
    onLoadSuccess: function(result) {
      this.clear();
      for (var $__30 = result.documents[Symbol.iterator](),
          $__31; !($__31 = $__30.next()).done; ) {
        var data = $__31.value;
        {
          this.appendItem(new Document(data));
        }
      }
      if (result.length == 1) {
        this.select(0);
      }
    },
    select: function(index) {
      index = index % this.items.length;
      if (this.selectedItem) {
        this.selectedItem.$element.removeClass('selected');
      }
      if (index == -1) {
        this.selectedItem = null;
        return;
      }
      this.selectedItem = this.items[index];
      this.selectedItem.$element.addClass('selected');
    },
    deselect: function() {
      this.select(-1);
    },
    selectNextItem: function() {
      this.select(this.selectedIndex + 1);
    },
    selectPreviousItem: function() {
      if (this.selectedItem) {
        this.select(this.selectedIndex - 1 + this.items.length);
      } else {
        this.select(this.items.length - 1);
      }
    }
  }, {}, Component);
  return {get List() {
      return List;
    }};
});
System.register("../bikeshed/static/bikeshed/SearchForm", [], function() {
  "use strict";
  var __moduleName = "../bikeshed/static/bikeshed/SearchForm";
  var Component = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/framework/Component")).Component;
  var Document = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/Document")).Document;
  var SearchForm = function SearchForm() {
    var options = arguments[0] !== (void 0) ? arguments[0] : {};
    _.defaults(options, {cssClass: 'bikeshed-searchform'});
    $traceurRuntime.superCall(this, $SearchForm.prototype, "constructor", [options]);
    this.$input = this.appendElement('<input type="text"/>');
    this.appendElement('<i class="fa fa-search" />');
    this.$input.on('keydown', this.onSearchInputChange.bind(this));
    this.typingTimeout = null;
    this.lastQuery = null;
  };
  var $SearchForm = SearchForm;
  ($traceurRuntime.createClass)(SearchForm, {
    onQueryChange: function(query) {
      if (query !== this.lastQuery) {
        this.emit('change');
        this.lastQuery = query;
      }
    },
    onSearchInputChange: function(e) {
      var $__33 = this;
      if (this.typingTimeout) {
        clearTimeout(this.typingTimeout);
        this.typingTimeout = null;
      }
      this.typingTimeout = setTimeout((function() {
        $__33.onQueryChange($__33.query);
        $__33.typingTimeout = null;
      }), 333);
    },
    get query() {
      return this.$input.val();
    },
    set query(q) {
      this.$input.val(q);
      this.onQueryChange(q);
    },
    focus: function() {
      this.$input.focus();
    }
  }, {}, Component);
  return {get SearchForm() {
      return SearchForm;
    }};
});
System.register("../bikeshed/static/bikeshed/Picker", [], function() {
  "use strict";
  var __moduleName = "../bikeshed/static/bikeshed/Picker";
  var Component = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/framework/Component")).Component;
  var List = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/List")).List;
  var SearchForm = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/SearchForm")).SearchForm;
  var Picker = function Picker() {
    var options = arguments[0] !== (void 0) ? arguments[0] : {};
    _.defaults(options, {cssClass: 'bikeshed-picker'});
    $traceurRuntime.superCall(this, $Picker.prototype, "constructor", [options]);
    this.resource = options.resource;
    this.searchForm = this.append(new SearchForm({}));
    this.searchForm.on('change', this.onSearchChange.bind(this));
    this.searchForm.$input.on('keydown', this.onSearchInputKeyDown.bind(this));
    this.list = this.append(new List({
      resource: this.resource,
      render: function(item) {
        var doc = item.data;
        var type = doc.getHeader('Type', '');
        var label = doc.label[0] == '#' ? (doc.label + ":") : '';
        var title = label ? doc.title : doc.label;
        return $(("<li><b>" + label + " </b>" + title + "<span class=\"type\">" + type + "</span></li>"));
      }
    }));
    this.list.on('select', this.onSelect.bind(this));
  };
  var $Picker = Picker;
  ($traceurRuntime.createClass)(Picker, {
    onSelect: function(doc) {
      this.emit('select', doc);
    },
    onSearchInputKeyDown: function(e) {
      switch (e.keyCode) {
        case 13:
          var doc = this.list.getSelection();
          if (doc) {
            this.onSelect(doc);
            e.preventDefault();
            return false;
          }
          break;
        case 38:
          this.list.selectPreviousItem();
          e.preventDefault();
          return false;
        case 40:
          this.list.selectNextItem();
          e.preventDefault();
          return false;
      }
    },
    onSearchChange: function() {
      this.list.load({data: {q: this.searchForm.query}});
    },
    set query(q) {
      this.searchForm.query = q;
    },
    get query() {
      return this.searchForm.query;
    },
    focus: function() {
      this.searchForm.focus();
    }
  }, {}, Component);
  return {get Picker() {
      return Picker;
    }};
});
System.register("../bikeshed/static/bikeshed/framework/Popup", [], function() {
  "use strict";
  var __moduleName = "../bikeshed/static/bikeshed/framework/Popup";
  var Component = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/framework/Component")).Component;
  var Popup = function Popup() {
    var options = arguments[0] !== (void 0) ? arguments[0] : {};
    var $__38 = this;
    _.defaults(options, {
      cssClass: 'bikeshed-popup',
      title: '',
      autodispose: true
    });
    $traceurRuntime.superCall(this, $Popup.prototype, "constructor", [options]);
    this.appendElement(("<header><span>" + options.title + "</span><a href=\"#close\">⨯</a></header>"));
    this.autodispose = options.autodispose;
    this.content = options.content;
    if (this.content) {
      this.append(this.content);
    }
    if (options.width) {
      this.$element.css('width', options.width);
    }
    this.addActions({close: this.close.bind(this)});
    this.$overlay = $('<div class="bikeshed-overlay"></div>');
    this.$overlay.append(this.$element);
    $('body').append(this.$overlay);
    this.$element.on('keydown', (function(e) {
      if (e.keyCode == 27) {
        $__38.close();
      }
    }));
  };
  var $Popup = Popup;
  ($traceurRuntime.createClass)(Popup, {
    show: function() {
      $traceurRuntime.superCall(this, $Popup.prototype, "show", []);
      this.$overlay.show();
    },
    hide: function() {
      this.$overlay.hide();
      $traceurRuntime.superCall(this, $Popup.prototype, "hide", []);
    },
    close: function() {
      if (this.autodispose) {
        this.dispose();
      } else {
        this.hide();
      }
    },
    dispose: function() {
      this.hide();
      this.$overlay.remove();
      this.emit('dispose');
    }
  }, {}, Component);
  return {get Popup() {
      return Popup;
    }};
});
System.register("../bikeshed/static/bikeshed/Completer", [], function() {
  "use strict";
  var __moduleName = "../bikeshed/static/bikeshed/Completer";
  var List = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/List")).List;
  var Popup = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/framework/Popup")).Popup;
  var Picker = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/Picker")).Picker;
  function positionEqual(a, b) {
    return a && b && a.row == b.row & a.column == b.column;
  }
  var Completer = function Completer(options) {
    this.lookup = options.lookup || 'Number';
    this.resource = options.resource;
    var editor = this.editor = options.editor;
    this.lookups = {
      '@': 'Name',
      '#': 'Number'
    };
    var lookupChars = _.keys(this.lookups).join('');
    this.pattern = ("([^\\w]|^)([" + lookupChars + "]\\w*)");
    this.editorOnCommandKey = editor.keyBinding.onCommandKey;
    this.boundEditorOnCommandKey = this.editorOnCommandKey.bind(editor.keyBinding);
    this.hijackedOnCommandKey = this.onCommandKey.bind(this);
    this.focusedToken = null;
    this.active = false;
    this.activeStart = null;
    this.dropdownList = new List({
      cssClass: 'bikeshed-autocomplete',
      resource: this.resource
    });
    for (var i = 0; i < 5; i++) {
      this.dropdownList.appendItem({label: ("#" + i + "1 Ticket")});
    }
    this.dropdownList.on('select', (function(doc) {
      this.complete(doc);
      this.editor.focus();
    }).bind(this));
    editor.container.ownerDocument.body.appendChild(this.dropdownList.element);
    editor.on('blur', this.deactivate.bind(this));
    this.install();
  };
  ($traceurRuntime.createClass)(Completer, {
    install: function() {
      var $__41 = this;
      var session = this.editor.getSession();
      session.selection.on('changeCursor', (function() {
        setTimeout($__41.onCursorChange.bind($__41), 1);
      }));
    },
    onCursorChange: function() {
      var session = this.editor.getSession();
      var cursor = this.editor.selection.getCursor();
      var line = session.getLine(cursor.row);
      var match = null,
          col = cursor.column;
      var re = new RegExp(this.pattern, 'g');
      while (match = re.exec(line)) {
        var token = match[2];
        var index = match.index + match[1].length;
        if (col >= index && col <= index + token.length) {
          var range = new AceRange(cursor.row, index, cursor.row, index + token.length);
          this.focusedToken = {
            token: token,
            range: range,
            cursor: cursor
          };
          this.activate();
          return;
        }
      }
      this.focusToken = null;
      this.deactivate();
    },
    getLineHeight: function() {
      return 21;
    },
    deactivate: function() {
      this.dropdownList.hide();
      this.dropdownList.clear();
      this.hijackCommandKeyEvents(false);
      this.activeStart = null;
    },
    activate: function() {
      var start = this.focusedToken.range.start;
      if (!positionEqual(this.activeStart, start)) {
        var coords = this.editor.renderer.textToScreenCoordinates(start.row, start.column);
        this.dropdownList.$element.css({
          left: coords.pageX - 4 + 'px',
          top: coords.pageY + this.getLineHeight() + 'px'
        }).show();
        this.hijackCommandKeyEvents(true);
        this.activeStart = start;
      }
      var token = this.focusedToken.token;
      var lookup = this.lookups[token[0]];
      var q = token.length > 1 ? (lookup + ":" + token.substring(1) + "*") : '';
      this.dropdownList.load({data: {q: q}});
    },
    hijackCommandKeyEvents: function(hijack) {
      this.editor.keyBinding.onCommandKey = hijack !== false ? this.hijackedOnCommandKey : this.editorOnCommandKey;
    },
    complete: function(doc) {
      var session = this.editor.getSession();
      session.replace(this.focusedToken.range, doc.label);
      this.deactivate();
    },
    onCommandKey: function(e, hashId, keyCode) {
      var $__41 = this;
      if (!this.focusedToken) {
        return this.boundEditorOnCommandKey(e, hashId, keyCode);
      }
      switch (keyCode) {
        case 9:
          var s = this.dropdownList.getSelection();
          if (s) {
            this.complete(s);
          } else {
            var picker = new Picker({resource: this.resource});
            var popup = new Popup({
              title: 'Pick a document',
              width: '600px',
              content: picker
            });
            popup.show();
            this.editor.blur();
            picker.focus();
            picker.on('select', (function(doc) {
              $__41.complete(doc);
              popup.dispose();
            }));
            popup.on('dispose', (function() {
              $__41.editor.focus();
            }));
          }
          break;
        case 13:
          var doc = this.dropdownList.getSelection();
          if (!doc) {
            this.deactivate();
            return this.boundEditorOnCommandKey(e, hashId, keyCode);
          }
          this.complete(doc);
          break;
        case 27:
          this.deactivate();
          return;
        case 38:
          this.dropdownList.selectPreviousItem();
          break;
        case 40:
          this.dropdownList.selectNextItem();
          break;
        default:
          return this.boundEditorOnCommandKey(e, hashId, keyCode);
      }
      e.preventDefault();
    }
  }, {});
  return {get Completer() {
      return Completer;
    }};
});
System.register("../bikeshed/static/bikeshed/DocumentEditor", [], function() {
  "use strict";
  var __moduleName = "../bikeshed/static/bikeshed/DocumentEditor";
  var Component = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/framework/Component")).Component;
  var Document = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/Document")).Document;
  var DocumentEditor = function DocumentEditor() {
    var options = arguments[0] !== (void 0) ? arguments[0] : {};
    _.defaults(options, {'cssClass': 'bikeshed-editor'});
    $traceurRuntime.superCall(this, $DocumentEditor.prototype, "constructor", [options]);
    this.doc = options.doc || new Document({
      headers: [],
      body: '',
      text: ''
    });
    var aceWrapper = $('<div/>');
    this.$element.append(aceWrapper);
    var editor = this.editor = ace.edit(aceWrapper.get(0));
    editor.setOptions({maxLines: Infinity});
    editor.setTheme("ace/theme/github");
    editor.setHighlightActiveLine(false);
    editor.setShowPrintMargin(false);
    editor.renderer.setShowGutter(false);
    var session = editor.getSession();
    session.setTabSize(4);
    session.setUseSoftTabs(true);
    var text = options.text || this.doc.text;
    session.setValue(text);
  };
  var $DocumentEditor = DocumentEditor;
  ($traceurRuntime.createClass)(DocumentEditor, {
    focus: function() {
      this.editor.focus();
    },
    save: function() {
      this.doc.setText(this.editor.getValue());
      this.emit('save', this.doc);
    },
    setDocument: function(doc) {
      this.doc = doc;
      this.editor.getSession().setValue(doc.text);
    }
  }, {}, Component);
  return {get DocumentEditor() {
      return DocumentEditor;
    }};
});
System.register("../bikeshed/static/bikeshed/EditorPage", [], function() {
  "use strict";
  var __moduleName = "../bikeshed/static/bikeshed/EditorPage";
  var DocumentPage = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/DocumentPage")).DocumentPage;
  var Document = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/Document")).Document;
  var DocumentEditor = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/DocumentEditor")).DocumentEditor;
  var Completer = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/Completer")).Completer;
  var EditorPage = function EditorPage() {
    var options = arguments[0] !== (void 0) ? arguments[0] : {};
    var $__46 = this;
    $traceurRuntime.superCall(this, $EditorPage.prototype, "constructor", [options]);
    this.addToSidebar($('<a href="#save"><i class="fa fa-check"/>Save</a>'));
    this.addToSidebar($('<a href="#cancel"><i class="fa fa-times"/>Cancel</a>'));
    this.editor = new DocumentEditor({resource: this.resource});
    this.$element.append(this.editor.$element);
    this.addActions({
      cancel: (function(e) {
        if ($__46.doc.uid) {
          $__46.app.visit(("/view/" + $__46.doc.uid + "/"));
        } else {
          $__46.app.visit('/');
        }
      }),
      save: (function(e) {
        $__46.editor.save();
      })
    });
    this.editor.on('save', (function(doc) {
      $__46.resource.save(doc).then((function(doc) {
        console.log("postsave", doc);
        $__46.app.visit(("/view/" + doc.uid + "/"));
      }));
    }));
    this.completer = new Completer({
      editor: this.editor.editor,
      resource: this.resource
    });
  };
  var $EditorPage = EditorPage;
  ($traceurRuntime.createClass)(EditorPage, {
    onDocumentLoaded: function(doc) {
      $traceurRuntime.superCall(this, $EditorPage.prototype, "onDocumentLoaded", [doc]);
      this.editor.setDocument(doc);
    },
    open: function(params) {
      var $__46 = this;
      return $traceurRuntime.superCall(this, $EditorPage.prototype, "open", [params]).then((function(doc) {
        return $__46.editor.focus();
      }));
    }
  }, {}, DocumentPage);
  return {get EditorPage() {
      return EditorPage;
    }};
});
System.register("../bikeshed/static/bikeshed/IndexPage", [], function() {
  "use strict";
  var __moduleName = "../bikeshed/static/bikeshed/IndexPage";
  var PageWithSidebar = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/PageWithSidebar")).PageWithSidebar;
  var IndexPage = function IndexPage() {
    var options = arguments[0] !== (void 0) ? arguments[0] : {};
    $traceurRuntime.superCall(this, $IndexPage.prototype, "constructor", [options]);
    this.addToSidebar($('<a href="/new/">New</a>'));
    this.addToSidebar($('<a href="/search/">Search</a>'));
    this.addToSidebar($('<a href="/search/?q=Type:Project">Projects</a>'));
  };
  var $IndexPage = IndexPage;
  ($traceurRuntime.createClass)(IndexPage, {}, {}, PageWithSidebar);
  return {get IndexPage() {
      return IndexPage;
    }};
});
System.register("../bikeshed/static/bikeshed/ListPage", [], function() {
  "use strict";
  var __moduleName = "../bikeshed/static/bikeshed/ListPage";
  var PageWithSidebar = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/PageWithSidebar")).PageWithSidebar;
  var Picker = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/Picker")).Picker;
  var ListPage = function ListPage() {
    var options = arguments[0] !== (void 0) ? arguments[0] : {};
    var $__51 = this;
    _.defaults(options, {cssClass: 'bikeshed-search'});
    $traceurRuntime.superCall(this, $ListPage.prototype, "constructor", [options]);
    this.resource = options.resource;
    this.picker = this.append(new Picker({resource: this.resource}));
    this.picker.on('select', (function(doc) {
      $__51.app.visit(("/view/" + doc.uid + "/"));
    }));
  };
  var $ListPage = ListPage;
  ($traceurRuntime.createClass)(ListPage, {open: function(params) {
      var $__51 = this;
      this.picker.query = params.q || '';
      return $traceurRuntime.superCall(this, $ListPage.prototype, "open", [params]).then((function() {
        return $__51.picker.focus();
      }));
    }}, {}, PageWithSidebar);
  return {get ListPage() {
      return ListPage;
    }};
});
System.register("../bikeshed/static/bikeshed/LoginPage", [], function() {
  "use strict";
  var __moduleName = "../bikeshed/static/bikeshed/LoginPage";
  var Page = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/framework/Page")).Page;
  var Document = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/Document")).Document;
  var LoginPage = function LoginPage() {
    var options = arguments[0] !== (void 0) ? arguments[0] : {};
    var $__54 = this;
    _.defaults(options, {cssClass: 'bikeshed-login'});
    $traceurRuntime.superCall(this, $LoginPage.prototype, "constructor", [options]);
    this.api = options.api;
    this.$loginForm = $('<form class="bikeshed-login" target="login_target" autocomplete="on" action="/void/" method="POST"/>');
    this.$usernameInput = $('<input type="text" placeholder="Username" name="username"/>');
    this.$passwordInput = $('<input type="password" placeholder="Password" name="password"/>');
    this.$element.append($('<iframe id="login_target" name="login_target" src="javascript:false" style="display:none"/>'));
    this.$loginForm.append(this.$usernameInput, this.$passwordInput);
    this.$element.append(this.$loginForm);
    this.$loginForm.on('keypress', (function(e) {
      if (e.keyCode == 13) {
        $__54.submit();
        return false;
      }
    }));
  };
  var $LoginPage = LoginPage;
  ($traceurRuntime.createClass)(LoginPage, {
    open: function(params) {
      var $__54 = this;
      return $traceurRuntime.superCall(this, $LoginPage.prototype, "open", [params]).then((function() {
        return $__54.$usernameInput.focus();
      }));
    },
    submit: function() {
      var $__54 = this;
      var credentials = {
        username: this.$usernameInput.val(),
        password: this.$passwordInput.val()
      };
      this.$loginForm.submit();
      this.api.post('/authenticate/', {
        dataType: 'json',
        data: JSON.stringify(credentials)
      }).then((function(response) {
        $__54.app.login(response.session_key, new Document(response.user));
      }));
    }
  }, {}, Page);
  return {get LoginPage() {
      return LoginPage;
    }};
});
System.register("../bikeshed/static/bikeshed/ViewerPage", [], function() {
  "use strict";
  var __moduleName = "../bikeshed/static/bikeshed/ViewerPage";
  var DocumentPage = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/DocumentPage")).DocumentPage;
  var Document = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/Document")).Document;
  var ViewerPage = function ViewerPage() {
    var options = arguments[0] !== (void 0) ? arguments[0] : {};
    var $__57 = this;
    $traceurRuntime.superCall(this, $ViewerPage.prototype, "constructor", [options]);
    this.$display = this.appendElement('<div class="document-display"/>');
    this.addToSidebar('<a href="#edit"><i class="fa fa-edit"/> Edit</a>');
    this.addToSidebar('<a href="#children"><i class="fa fa-level-down"/> Children</a>');
    this.addToSidebar('<a href="#board"><i class="fa fa-th"/> Board</a>');
    this.addActions({
      board: (function(e) {
        $__57.app.visit(("/board/" + $__57.doc.uid + "/"));
      }),
      edit: (function(e) {
        $__57.app.visit(("/edit/" + $__57.doc.uid + "/"));
      }),
      children: (function(e) {
        $__57.app.visit(("/search/?q=Project:" + $__57.doc.uid + "%20OR%20Parent:" + $__57.doc.uid));
      })
    });
  };
  var $ViewerPage = ViewerPage;
  ($traceurRuntime.createClass)(ViewerPage, {onDocumentLoaded: function(doc) {
      $traceurRuntime.superCall(this, $ViewerPage.prototype, "onDocumentLoaded", [doc]);
      this.$display.html(doc.html);
    }}, {}, DocumentPage);
  return {get ViewerPage() {
      return ViewerPage;
    }};
});
System.register("../bikeshed/static/bikeshed/framework/API", [], function() {
  "use strict";
  var __moduleName = "../bikeshed/static/bikeshed/framework/API";
  var EventEmitter = $traceurRuntime.assertObject(System.get("../bikeshed/static/EventEmitter")).EventEmitter;
  var API = function API() {
    var options = arguments[0] !== (void 0) ? arguments[0] : {};
    $traceurRuntime.superCall(this, $API.prototype, "constructor", []);
    _.defaults(options, {
      baseUrl: '',
      defaultContentType: 'application/json',
      defaultHeaders: {}
    });
    this.baseUrl = options.baseUrl;
    this.defaultContentType = options.defaultContentType;
    this.defaultHeaders = options.defaultHeaders;
  };
  var $API = API;
  ($traceurRuntime.createClass)(API, {
    setDefaultHeader: function(name, value) {
      this.defaultHeaders[name] = value;
    },
    removeDefaultHeader: function(name) {
      delete this.defaultHeaders[name];
    },
    request: function(url) {
      var options = arguments[1] !== (void 0) ? arguments[1] : {};
      var $__60 = this;
      if (!options.absolute) {
        url = this.baseUrl + url;
      }
      _.defaults(options, {
        contentType: this.defaultContentType,
        dataType: 'json',
        headers: {}
      });
      _.extend(options.headers, this.defaultHeaders);
      console.log("API.request", url, options.headers);
      return new Promise((function(resolve, reject) {
        options.success = resolve;
        options.error = (function(xhr, status, error) {
          if (xhr.status == 401) {
            $__60.emit('unauthorizedRequest', xhr);
          } else {
            console.log("ERROR", status, error, xhr);
          }
          reject();
        });
        $.ajax(url, options);
      }));
    },
    post: function(url) {
      var options = arguments[1] !== (void 0) ? arguments[1] : {};
      _.defaults(options, {type: 'POST'});
      return this.request(url, options);
    }
  }, {}, EventEmitter);
  return {get API() {
      return API;
    }};
});
System.register("../bikeshed/static/bikeshed/framework/Session", [], function() {
  "use strict";
  var __moduleName = "../bikeshed/static/bikeshed/framework/Session";
  var EventEmitter = $traceurRuntime.assertObject(System.get("../bikeshed/static/EventEmitter")).EventEmitter;
  var Session = function Session() {
    var options = arguments[0] !== (void 0) ? arguments[0] : {};
    $traceurRuntime.superCall(this, $Session.prototype, "constructor", []);
    _.defaults(options, {key: 'bikeshed.session'});
    this.key = options.key;
    this.data = JSON.parse(localStorage[this.key] || '{}');
  };
  var $Session = Session;
  ($traceurRuntime.createClass)(Session, {
    set: function(name, value) {
      this.data[name] = value;
      localStorage[this.key] = JSON.stringify(this.data);
    },
    get: function(name) {
      return this.data[name];
    }
  }, {}, EventEmitter);
  return {get Session() {
      return Session;
    }};
});
System.register("../bikeshed/static/bikeshed/framework/Window", [], function() {
  "use strict";
  var __moduleName = "../bikeshed/static/bikeshed/framework/Window";
  var Component = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/framework/Component")).Component;
  var Window = function Window() {
    var options = arguments[0] !== (void 0) ? arguments[0] : {};
    var $__65 = this;
    $traceurRuntime.superCall(this, $Window.prototype, "constructor", [options]);
    this.$header = this.appendElement('<header><a href="/">promise less <b>|</b> do more</a><a href="#logout">Logout</a></header>');
    this.$pages = this.appendElement('<div class="pages"/>');
    this.$userInfo = $('<span class="user"/>');
    this.$header.append(this.$userInfo);
    var app = options.app;
    app.on('login', (function(user) {
      $__65.$userInfo.show();
      $__65.$userInfo.text(user.label);
    }));
    app.on('logout', (function() {
      $__65.$userInfo.hide();
      $__65.$userInfo.text('');
    }));
  };
  var $Window = Window;
  ($traceurRuntime.createClass)(Window, {addPage: function(page) {
      this.$pages.append(page.$element);
    }}, {}, Component);
  return {get Window() {
      return Window;
    }};
});
System.register("../bikeshed/static/bikeshed/framework/Application", [], function() {
  "use strict";
  var __moduleName = "../bikeshed/static/bikeshed/framework/Application";
  var EventEmitter = $traceurRuntime.assertObject(System.get("../bikeshed/static/EventEmitter")).EventEmitter;
  var Session = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/framework/Session")).Session;
  var Window = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/framework/Window")).Window;
  var Application = function Application() {
    var options = arguments[0] !== (void 0) ? arguments[0] : {};
    _.defaults(options, {element: 'body'});
    $traceurRuntime.superCall(this, $Application.prototype, "constructor", [options]);
    this.session = options.session || new Session({});
    this.root = new Window({
      element: options.element,
      app: this
    });
    this.pages = {};
    this.splash = options.splash;
    this.currentPage = null;
    this.helperA = document.createElement('a');
    $('body').on('click', 'a', this.onLinkClick.bind(this));
    $(window).on('popstate', this.onHistoryChange.bind(this));
    this.routes = [];
    this._loading = false;
    _.each(options.pages, function(page, path) {
      this.addPage(path, page);
    }, this);
  };
  var $Application = Application;
  ($traceurRuntime.createClass)(Application, {
    addPage: function(path, page) {
      this.pages[path] = page;
      page.app = this;
      var params = ['__path__'];
      var pattern = path.replace(/:\w+/g, function(match) {
        params.push(match.substring(1));
        return '([^/]+)';
      });
      var re = new RegExp(("^" + pattern + "$"));
      this.routes.push({
        re: re,
        params: params,
        page: page,
        path: path
      });
      this.root.addPage(page);
    },
    start: function() {
      var $__68 = this;
      this.visit(location.pathname + location.search).then((function() {
        if ($__68.splash) {
          $($__68.splash).remove();
        }
      }));
    },
    get loading() {
      return this._loading;
    },
    set loading(load) {
      this._loading = load;
      this.root.$element[load ? 'addClass' : 'removeClass']('loading');
    },
    onHistoryChange: function() {
      this.visit(location.pathname + location.search, false);
    },
    parsePath: function(url) {
      this.helperA.href = url;
      var path = this.helperA.pathname;
      var querystring = this.helperA.search;
      var params = {};
      if (querystring) {
        querystring = querystring.substring(1);
        querystring.split('&').forEach((function(pair) {
          var $__72 = $traceurRuntime.assertObject(pair.split('=')),
              key = $__72[0],
              value = $__72[1];
          params[decodeURIComponent(key)] = decodeURIComponent(value);
        }));
      }
      return {
        path: path,
        params: params
      };
    },
    visit: function(url, pushstate) {
      var $__68 = this;
      console.log("VISIT", url);
      var pathInfo = this.parsePath(url);
      if (pushstate !== false) {
        history.pushState(pathInfo.params, null, url);
      }
      var path = pathInfo.path;
      var page = null,
          params = pathInfo.params;
      for (var $__70 = this.routes[Symbol.iterator](),
          $__71; !($__71 = $__70.next()).done; ) {
        var route = $__71.value;
        {
          var match = route.re.exec(path);
          if (match) {
            page = route.page;
            _.extend(params, _.zipObject(route.params, match));
            break;
          }
        }
      }
      if (!page) {
        throw new Error(("404: " + path));
      }
      if (this.currentPage !== page) {
        if (this.currentPage) {
          this.currentPage.close();
        }
        this.currentPage = page;
      }
      this.loading = true;
      return page.open(params).then((function() {
        $__68.loading = false;
      })).catch((function(error) {
        console.log("failed to open page", error);
        page.close();
      }));
    },
    onLinkClick: function(e) {
      var $link = $(e.target);
      if ($link.prop('tagName') != 'A') {
        $link = $link.parents('a');
      }
      var url = $link.attr('href');
      if (url.match(/:\/\//)) {
        return true;
      }
      if (url == '#') {
        return false;
      }
      e.preventDefault();
      this.visit(url);
    }
  }, {}, EventEmitter);
  return {get Application() {
      return Application;
    }};
});
System.register("../bikeshed/static/bikeshed/framework/Resource", [], function() {
  "use strict";
  var __moduleName = "../bikeshed/static/bikeshed/framework/Resource";
  var EventEmitter = $traceurRuntime.assertObject(System.get("../bikeshed/static/EventEmitter")).EventEmitter;
  var Resource = function Resource(api, url, model) {
    var options = arguments[3] !== (void 0) ? arguments[3] : {};
    this.api = api;
    this.url = url;
    this.model = model;
  };
  ($traceurRuntime.createClass)(Resource, {
    request: function() {
      var options = arguments[0] !== (void 0) ? arguments[0] : {};
      return this.api.request(options.url || this.url, options);
    },
    get: function() {
      var options = arguments[0] !== (void 0) ? arguments[0] : {};
      _.defaults(options, {type: 'GET'});
      return this.request(options);
    },
    post: function() {
      var options = arguments[0] !== (void 0) ? arguments[0] : {};
      _.defaults(options, {type: 'POST'});
      return this.request(options);
    },
    fetch: function(id) {
      var options = arguments[1] !== (void 0) ? arguments[1] : {};
      var $__73 = this;
      _.defaults(options, {url: ("" + this.url + id + "/")});
      console.log('fetch', id, options);
      return this.get(options).then((function(data) {
        return new $__73.model(data);
      }));
    },
    save: function(model) {
      var options = arguments[1] !== (void 0) ? arguments[1] : {};
      if (model.url) {
        options.url = model.url;
        options.absolute = true;
        options.type = 'PUT';
      } else {
        options.type = 'POST';
      }
      _.extend(options, model.serialize());
      return this.request(options).then((function(data) {
        model.load(data);
        return model;
      }));
    }
  }, {}, EventEmitter);
  return {get Resource() {
      return Resource;
    }};
});
System.register("../bikeshed/static/bikeshed/main", [], function() {
  "use strict";
  var __moduleName = "../bikeshed/static/bikeshed/main";
  var Application = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/framework/Application")).Application;
  var API = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/framework/API")).API;
  var Resource = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/framework/Resource")).Resource;
  var Model = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/framework/Model")).Model;
  var Collection = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/Collection")).Collection;
  var Document = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/Document")).Document;
  var EditorPage = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/EditorPage")).EditorPage;
  var ViewerPage = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/ViewerPage")).ViewerPage;
  var BoardPage = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/BoardPage")).BoardPage;
  var IndexPage = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/IndexPage")).IndexPage;
  var ListPage = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/ListPage")).ListPage;
  var LoginPage = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/LoginPage")).LoginPage;
  var BikeshedAPI = function BikeshedAPI() {
    $traceurRuntime.defaultSuperCall(this, $BikeshedAPI.prototype, arguments);
  };
  var $BikeshedAPI = BikeshedAPI;
  ($traceurRuntime.createClass)(BikeshedAPI, {
    setSessionKey: function(sessionKey) {
      this.setDefaultHeader('Authorization', 'session ' + sessionKey);
    },
    removeSessionKey: function() {
      this.removeDefaultHeader('Authorization');
    }
  }, {}, API);
  var BikeshedApp = function BikeshedApp() {
    var options = arguments[0] !== (void 0) ? arguments[0] : {};
    $traceurRuntime.superCall(this, $BikeshedApp.prototype, "constructor", [options]);
    this.api = options.api;
    this.user = null;
    this.api.on('unauthorizedRequest', this.logout.bind(this));
    this.root.addAction('logout', this.logout.bind(this));
    this.initializeSession();
  };
  var $BikeshedApp = BikeshedApp;
  ($traceurRuntime.createClass)(BikeshedApp, {
    initializeSession: function() {
      var userId = this.session.get('userId');
      if (userId) {
        this.user = new Document({uid: userId});
      }
      this.api.setSessionKey(this.session.get('sessionKey'));
    },
    login: function(sessionKey, user) {
      this.user = user;
      this.api.setSessionKey(sessionKey);
      this.session.set('sessionKey', sessionKey);
      this.session.set('userId', user.uid);
      this.emit('login', user);
      this.visit('/');
    },
    logout: function() {
      this.api.removeSessionKey();
      this.user = null;
      this.emit('logout');
      this.visit('/login/');
    }
  }, {}, Application);
  function main() {
    var api = new BikeshedAPI({baseUrl: '/api'});
    var documents = new Resource(api, '/documents/', bikeshed.Document, {});
    var app = new BikeshedApp({
      api: api,
      element: '#body',
      splash: '#splash',
      pages: {
        '/': new IndexPage(),
        '/login/': new LoginPage({api: api}),
        '/search/': new ListPage({resource: documents}),
        '/new/': new EditorPage({resource: documents}),
        '/edit/:uid/': new EditorPage({resource: documents}),
        '/view/:uid/': new ViewerPage({resource: documents}),
        '/board/:uid/': new BoardPage({resource: documents})
      }
    });
    app.start();
  }
  return {get main() {
      return main;
    }};
});
System.register("../bikeshed/static/bikeshed/init", [], function() {
  "use strict";
  var __moduleName = "../bikeshed/static/bikeshed/init";
  var Component = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/framework/Component")).Component;
  var Page = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/framework/Page")).Page;
  var Application = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/framework/Application")).Application;
  var API = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/framework/API")).API;
  var Resource = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/framework/Resource")).Resource;
  var Model = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/framework/Model")).Model;
  var Session = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/framework/Session")).Session;
  var Collection = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/Collection")).Collection;
  var List = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/List")).List;
  var Completer = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/Completer")).Completer;
  var DocumentEditor = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/DocumentEditor")).DocumentEditor;
  var Document = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/Document")).Document;
  var EditorPage = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/EditorPage")).EditorPage;
  var ViewerPage = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/ViewerPage")).ViewerPage;
  var BoardPage = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/BoardPage")).BoardPage;
  var IndexPage = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/IndexPage")).IndexPage;
  var PageWithSidebar = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/PageWithSidebar")).PageWithSidebar;
  var ListPage = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/ListPage")).ListPage;
  var LoginPage = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/LoginPage")).LoginPage;
  var SearchForm = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/SearchForm")).SearchForm;
  var Card = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/Card")).Card;
  var main = $traceurRuntime.assertObject(System.get("../bikeshed/static/bikeshed/main")).main;
  var bikeshed = {
    main: main,
    Application: Application,
    Component: Component,
    List: List,
    Page: Page,
    Document: Document,
    Completer: Completer,
    SearchForm: SearchForm,
    DocumentEditor: DocumentEditor,
    Card: Card,
    PageWithSidebar: PageWithSidebar,
    ListPage: ListPage,
    IndexPage: IndexPage,
    EditorPage: EditorPage,
    ViewerPage: ViewerPage,
    LoginPage: LoginPage
  };
  bikeshed.framework = {
    API: API,
    Collection: Collection,
    Model: Model,
    Resource: Resource,
    Session: Session
  };
  window.bikeshed = bikeshed;
  $(function() {
    window.AceRange = ace.require('ace/range').Range;
  });
  return {get bikeshed() {
      return bikeshed;
    }};
});
System.get("../bikeshed/static/bikeshed/init" + '');
