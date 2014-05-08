System.register("EventEmitter", [], function() {
  "use strict";
  var __moduleName = "EventEmitter";
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
System.register("pldm/Collection", [], function() {
  "use strict";
  var __moduleName = "pldm/Collection";
  var EventEmitter = $traceurRuntime.assertObject(System.get("EventEmitter")).EventEmitter;
  var Collection = function Collection(options) {
    this.factory = options.factory || _.identity;
    this.url = options.url;
  };
  ($traceurRuntime.createClass)(Collection, {}, {}, EventEmitter);
  var Collection = Collection;
  return {get Collection() {
      return Collection;
    }};
});
System.register("pldm/Document", [], function() {
  "use strict";
  var __moduleName = "pldm/Document";
  var Collection = $traceurRuntime.assertObject(System.get("pldm/Collection")).Collection;
  var Document = function Document(data, options) {
    this.collection = options && options.collection;
    this.load(data);
  };
  var $Document = Document;
  ($traceurRuntime.createClass)(Document, {
    load: function(data) {
      this.headers = {};
      if (data.headers) {
        for (var $__4 = data.headers[Symbol.iterator](),
            $__5; !($__5 = $__4.next()).done; ) {
          var attr = $__5.value;
          {
            this.headers[attr.key.toLowerCase()] = attr;
          }
        }
      }
      this.uid = data.uid;
      this.body = data.body || '';
      this._label = data.label;
      this.text = data.text || '';
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
    setText: function(text) {
      this.text = text;
    },
    get collectionUrl() {
      var collection = this.collection || this.constructor.collection;
      if (collection) {
        return collection.url;
      }
      return null;
    },
    save: function() {
      var $__2 = this;
      var url = this.url || this.collectionUrl;
      if (!url) {
        throw new Error("cannot create object outside of collection");
      }
      return new Promise((function(resolve, reject) {
        $.ajax(url, {
          type: $__2.url ? 'PUT' : 'POST',
          dataType: 'json',
          contentType: 'text/plain',
          data: $__2.text,
          success: (function(data) {
            $__2.load(data);
            resolve($__2);
          }),
          error: reject
        });
      }));
    },
    createViewLink: function() {
      var title = this.displayTitle;
      return $(("<a href=\"/view/" + this.uid + "/\" title=\"" + title + "\">" + title + "</a>"));
    }
  }, {});
  var documentCollection = new Collection({
    factory: Document,
    url: '/api/documents/'
  });
  Document.collection = documentCollection;
  var Document = Document;
  var documentCollection = documentCollection;
  return {
    get Document() {
      return Document;
    },
    get documentCollection() {
      return documentCollection;
    }
  };
});
System.register("pldm/framework/Component", [], function() {
  "use strict";
  var __moduleName = "pldm/framework/Component";
  var EventEmitter = $traceurRuntime.assertObject(System.get("EventEmitter")).EventEmitter;
  var ACTIONS_DATA_KEY = 'pldm-component-actions';
  var Component = function Component(options) {
    options = options || {};
    $traceurRuntime.superCall(this, $Component.prototype, "constructor", []);
    this.$element = $('<div class="pldm-component"></div>');
    if (options.cssClass) {
      this.$element.addClass(options.cssClass);
    }
    this.actions = null;
  };
  var $Component = Component;
  ($traceurRuntime.createClass)(Component, {
    appendElement: function(el) {
      var $el = $(el);
      this.$element.append($el);
      return $el;
    },
    append: function(component) {
      this.$element.append(component.$element);
      return component;
    },
    onActionClick: function(name, e) {
      this.actions[name].call(this, e);
    },
    addAction: function(name, handler) {
      if (!this.actions) {
        this.actions = {};
        this.$element.on('click', 'a', (function(e) {
          var url = $(e.target).attr('href');
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
      var $__7 = this;
      _.each(mapping, (function(handler, name) {
        return $__7.addAction(name, handler);
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
    }
  }, {}, EventEmitter);
  var Component = Component;
  return {get Component() {
      return Component;
    }};
});
System.register("pldm/List", [], function() {
  "use strict";
  var __moduleName = "pldm/List";
  var Component = $traceurRuntime.assertObject(System.get("pldm/framework/Component")).Component;
  var Document = $traceurRuntime.assertObject(System.get("pldm/Document")).Document;
  var ITEM_INDEX_DATA_KEY = 'pldm-list-item-index';
  var List = function List(options) {
    options = _.defaults(options, {cssClass: 'pldm-list'});
    $traceurRuntime.superCall(this, $List.prototype, "constructor", [options]);
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
    load: function(url) {
      var $__10 = this;
      return new Promise((function(resolve, reject) {
        $.ajax(url, {
          success: (function(result) {
            $__10.onLoadSuccess(result);
            resolve();
          }),
          error: (function(xhr, status, err) {
            $__10.onLoadError(xhr, status, err);
            reject(err);
          }),
          dataType: 'json'
        });
      }));
    },
    onLoadError: function() {
      console.log('error getting items', arguments);
    },
    onLoadSuccess: function(result) {
      this.clear();
      for (var $__12 = result.documents[Symbol.iterator](),
          $__13; !($__13 = $__12.next()).done; ) {
        var data = $__13.value;
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
  var List = List;
  return {get List() {
      return List;
    }};
});
System.register("pldm/SearchForm", [], function() {
  "use strict";
  var __moduleName = "pldm/SearchForm";
  var Component = $traceurRuntime.assertObject(System.get("pldm/framework/Component")).Component;
  var Document = $traceurRuntime.assertObject(System.get("pldm/Document")).Document;
  var SearchForm = function SearchForm(options) {
    options = _.defaults(options, {cssClass: 'pldm-searchform'});
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
      var $__15 = this;
      if (this.typingTimeout) {
        clearTimeout(this.typingTimeout);
        this.typingTimeout = null;
      }
      this.typingTimeout = setTimeout((function() {
        $__15.onQueryChange($__15.query);
        $__15.typingTimeout = null;
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
  var SearchForm = SearchForm;
  return {get SearchForm() {
      return SearchForm;
    }};
});
System.register("pldm/Picker", [], function() {
  "use strict";
  var __moduleName = "pldm/Picker";
  var Component = $traceurRuntime.assertObject(System.get("pldm/framework/Component")).Component;
  var List = $traceurRuntime.assertObject(System.get("pldm/List")).List;
  var SearchForm = $traceurRuntime.assertObject(System.get("pldm/SearchForm")).SearchForm;
  var Picker = function Picker(options) {
    _.defaults(options, {cssClass: 'pldm-picker'});
    $traceurRuntime.superCall(this, $Picker.prototype, "constructor", [options]);
    this.searchForm = new SearchForm({});
    this.$element.append(this.searchForm.$element);
    this.searchForm.on('change', this.onSearchChange.bind(this));
    this.searchForm.$input.on('keydown', this.onSearchInputKeyDown.bind(this));
    this.list = new List({render: function(item) {
        var doc = item.data;
        var type = doc.getHeader('Type', '');
        var label = doc.label[0] == '#' ? (doc.label + ":") : '';
        var title = label ? doc.title : doc.label;
        return $(("<li><b>" + label + " </b>" + title + "<span class=\"type\">" + type + "</span></li>"));
      }});
    this.$element.append(this.list.$element);
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
      var query = this.searchForm.query;
      this.list.load(("/api/documents/?q=" + query));
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
  var Picker = Picker;
  return {get Picker() {
      return Picker;
    }};
});
System.register("pldm/framework/Popup", [], function() {
  "use strict";
  var __moduleName = "pldm/framework/Popup";
  var Component = $traceurRuntime.assertObject(System.get("pldm/framework/Component")).Component;
  var Popup = function Popup(options) {
    var $__20 = this;
    _.defaults(options, {
      cssClass: 'pldm-popup',
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
    this.$overlay = $('<div class="pldm-overlay"></div>');
    this.$overlay.append(this.$element);
    $('body').append(this.$overlay);
    this.$element.on('keydown', (function(e) {
      if (e.keyCode == 27) {
        $__20.close();
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
  var Popup = Popup;
  return {get Popup() {
      return Popup;
    }};
});
System.register("pldm/Completer", [], function() {
  "use strict";
  var __moduleName = "pldm/Completer";
  var List = $traceurRuntime.assertObject(System.get("pldm/List")).List;
  var Popup = $traceurRuntime.assertObject(System.get("pldm/framework/Popup")).Popup;
  var Picker = $traceurRuntime.assertObject(System.get("pldm/Picker")).Picker;
  function positionEqual(a, b) {
    return a && b && a.row == b.row & a.column == b.column;
  }
  var Completer = function Completer(options) {
    this.url = options.url;
    this.lookup = options.lookup || 'Number';
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
    this.dropdownList = new List({cssClass: 'pldm-autocomplete'});
    for (var i = 0; i < 5; i++) {
      this.dropdownList.appendItem({label: ("#" + i + "1 Ticket")});
    }
    this.dropdownList.on('select', (function(doc) {
      this.complete(doc);
      this.editor.focus();
    }).bind(this));
    editor.container.ownerDocument.body.appendChild(this.dropdownList.element);
    this.install();
  };
  ($traceurRuntime.createClass)(Completer, {
    install: function() {
      var $__23 = this;
      var session = this.editor.getSession();
      session.selection.on('changeCursor', (function() {
        setTimeout($__23.onCursorChange.bind($__23), 1);
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
      this.dropdownList.load((this.url + "?q=" + q));
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
      var $__23 = this;
      if (!this.focusedToken) {
        return this.boundEditorOnCommandKey(e, hashId, keyCode);
      }
      switch (keyCode) {
        case 9:
          var s = this.dropdownList.getSelection();
          if (s) {
            this.complete(s);
          } else {
            var picker = new Picker({});
            var popup = new Popup({
              title: 'Pick a document',
              width: '600px',
              content: picker
            });
            popup.show();
            this.editor.blur();
            picker.focus();
            picker.on('select', (function(doc) {
              $__23.complete(doc);
              popup.dispose();
            }));
            popup.on('dispose', (function() {
              $__23.editor.focus();
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
  var Completer = Completer;
  return {get Completer() {
      return Completer;
    }};
});
System.register("pldm/DocumentEditor", [], function() {
  "use strict";
  var __moduleName = "pldm/DocumentEditor";
  var Component = $traceurRuntime.assertObject(System.get("pldm/framework/Component")).Component;
  var Document = $traceurRuntime.assertObject(System.get("pldm/Document")).Document;
  var Completer = $traceurRuntime.assertObject(System.get("pldm/Completer")).Completer;
  var DocumentEditor = function DocumentEditor(options) {
    options = _.defaults(options, {'cssClass': 'pldm-editor'});
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
    this.completer = new Completer({
      editor: editor,
      url: '/api/documents/'
    });
  };
  var $DocumentEditor = DocumentEditor;
  ($traceurRuntime.createClass)(DocumentEditor, {
    focus: function() {
      this.editor.focus();
    },
    save: function() {
      this.doc.setText(this.editor.getValue());
      return this.doc.save();
    },
    setDocument: function(doc) {
      this.doc = doc;
      this.editor.getSession().setValue(doc.text);
    }
  }, {}, Component);
  var DocumentEditor = DocumentEditor;
  return {get DocumentEditor() {
      return DocumentEditor;
    }};
});
System.register("pldm/framework/Page", [], function() {
  "use strict";
  var __moduleName = "pldm/framework/Page";
  var Component = $traceurRuntime.assertObject(System.get("pldm/framework/Component")).Component;
  var Page = function Page(options) {
    options = _.defaults(options, {cssClass: 'pldm-page'});
    $traceurRuntime.superCall(this, $Page.prototype, "constructor", [options]);
    this.hide();
  };
  var $Page = Page;
  ($traceurRuntime.createClass)(Page, {
    open: function(params) {
      var $__28 = this;
      return new Promise((function(resolve, reject) {
        $__28.show();
        resolve();
      }));
    },
    close: function() {
      this.hide();
    }
  }, {}, Component);
  var Page = Page;
  return {get Page() {
      return Page;
    }};
});
System.register("pldm/PageWithSidebar", [], function() {
  "use strict";
  var __moduleName = "pldm/PageWithSidebar";
  var Page = $traceurRuntime.assertObject(System.get("pldm/framework/Page")).Page;
  var PageWithSidebar = function PageWithSidebar(options) {
    $traceurRuntime.superCall(this, $PageWithSidebar.prototype, "constructor", [options]);
    this.$sidebar = this.appendElement('<div class="pldm-sidebar"/>');
  };
  var $PageWithSidebar = PageWithSidebar;
  ($traceurRuntime.createClass)(PageWithSidebar, {addToSidebar: function(el) {
      this.$sidebar.append(el);
    }}, {}, Page);
  var PageWithSidebar = PageWithSidebar;
  return {get PageWithSidebar() {
      return PageWithSidebar;
    }};
});
System.register("pldm/DocumentPage", [], function() {
  "use strict";
  var __moduleName = "pldm/DocumentPage";
  var PageWithSidebar = $traceurRuntime.assertObject(System.get("pldm/PageWithSidebar")).PageWithSidebar;
  var Document = $traceurRuntime.assertObject(System.get("pldm/Document")).Document;
  var DocumentPage = function DocumentPage(options) {
    $traceurRuntime.superCall(this, $DocumentPage.prototype, "constructor", [options]);
    this.$path = this.appendElement('<div class="path"/>');
    this.$header = this.appendElement('<h1/>');
  };
  var $DocumentPage = DocumentPage;
  ($traceurRuntime.createClass)(DocumentPage, {
    onLoadError: function() {
      console.log("error", arguments);
    },
    onDocumentLoaded: function(doc) {
      var $__33 = this;
      console.log("document loaded", doc);
      this.doc = doc;
      this.$header.html((doc.label + ": " + doc.title));
      this.$path.empty();
      _.each(doc.path, (function(parent) {
        $__33.$path.append(parent.createViewLink());
        $__33.$path.append($('<b> / </b>'));
      }));
    },
    open: function(params) {
      var $__33 = this;
      var loaded = new Promise((function(resolve, reject) {
        if (!params.uid) {
          resolve();
          return;
        }
        $.ajax('/api/document/' + params.uid + '/', {
          type: 'GET',
          error: $__33.onLoadError.bind($__33),
          success: (function(data) {
            var doc = new Document(data);
            $__33.onDocumentLoaded(doc);
            resolve();
          })
        });
      }));
      return Promise.all([$traceurRuntime.superCall(this, $DocumentPage.prototype, "open", [params]), loaded]);
    }
  }, {}, PageWithSidebar);
  var DocumentPage = DocumentPage;
  return {get DocumentPage() {
      return DocumentPage;
    }};
});
System.register("pldm/EditorPage", [], function() {
  "use strict";
  var __moduleName = "pldm/EditorPage";
  var DocumentPage = $traceurRuntime.assertObject(System.get("pldm/DocumentPage")).DocumentPage;
  var Document = $traceurRuntime.assertObject(System.get("pldm/Document")).Document;
  var DocumentEditor = $traceurRuntime.assertObject(System.get("pldm/DocumentEditor")).DocumentEditor;
  var EditorPage = function EditorPage(options) {
    var $__36 = this;
    $traceurRuntime.superCall(this, $EditorPage.prototype, "constructor", [options]);
    this.addToSidebar($('<a href="#save"><i class="fa fa-check"/>Save</a>'));
    this.addToSidebar($('<a href="#cancel"><i class="fa fa-times"/>Cancel</a>'));
    this.editor = new DocumentEditor({});
    this.$element.append(this.editor.$element);
    this.addActions({
      cancel: (function(e) {
        if ($__36.doc.uid) {
          $__36.app.visit(("/view/" + $__36.doc.uid + "/"));
        } else {
          $__36.app.visit('/');
        }
      }),
      save: (function(e) {
        $__36.editor.save().then((function(doc) {
          $__36.app.visit(("/view/" + doc.uid + "/"));
        }));
      })
    });
  };
  var $EditorPage = EditorPage;
  ($traceurRuntime.createClass)(EditorPage, {
    onDocumentLoaded: function(doc) {
      $traceurRuntime.superCall(this, $EditorPage.prototype, "onDocumentLoaded", [doc]);
      this.editor.setDocument(doc);
    },
    open: function(params) {
      var $__36 = this;
      return $traceurRuntime.superCall(this, $EditorPage.prototype, "open", [params]).then((function(doc) {
        return $__36.editor.focus();
      }));
    }
  }, {}, DocumentPage);
  var EditorPage = EditorPage;
  return {get EditorPage() {
      return EditorPage;
    }};
});
System.register("pldm/IndexPage", [], function() {
  "use strict";
  var __moduleName = "pldm/IndexPage";
  var PageWithSidebar = $traceurRuntime.assertObject(System.get("pldm/PageWithSidebar")).PageWithSidebar;
  var IndexPage = function IndexPage(options) {
    $traceurRuntime.superCall(this, $IndexPage.prototype, "constructor", [options]);
    this.addToSidebar($('<a href="/new/">New</a>'));
    this.addToSidebar($('<a href="/search/">Search</a>'));
    this.addToSidebar($('<a href="/search/?q=Type:Project">Projects</a>'));
  };
  var $IndexPage = IndexPage;
  ($traceurRuntime.createClass)(IndexPage, {}, {}, PageWithSidebar);
  var IndexPage = IndexPage;
  return {get IndexPage() {
      return IndexPage;
    }};
});
System.register("pldm/ListPage", [], function() {
  "use strict";
  var __moduleName = "pldm/ListPage";
  var PageWithSidebar = $traceurRuntime.assertObject(System.get("pldm/PageWithSidebar")).PageWithSidebar;
  var Picker = $traceurRuntime.assertObject(System.get("pldm/Picker")).Picker;
  var ListPage = function ListPage(options) {
    var $__41 = this;
    _.defaults(options, {cssClass: 'pldm-search'});
    $traceurRuntime.superCall(this, $ListPage.prototype, "constructor", [options]);
    this.picker = new Picker({});
    this.$element.append(this.picker.$element);
    this.picker.on('select', (function(doc) {
      $__41.app.visit(("/view/" + doc.uid + "/"));
    }));
  };
  var $ListPage = ListPage;
  ($traceurRuntime.createClass)(ListPage, {open: function(params) {
      var $__41 = this;
      this.picker.query = params.q || '';
      return $traceurRuntime.superCall(this, $ListPage.prototype, "open", [params]).then((function() {
        return $__41.picker.focus();
      }));
    }}, {}, PageWithSidebar);
  var ListPage = ListPage;
  return {get ListPage() {
      return ListPage;
    }};
});
System.register("pldm/ViewerPage", [], function() {
  "use strict";
  var __moduleName = "pldm/ViewerPage";
  var DocumentPage = $traceurRuntime.assertObject(System.get("pldm/DocumentPage")).DocumentPage;
  var Document = $traceurRuntime.assertObject(System.get("pldm/Document")).Document;
  var ViewerPage = function ViewerPage(options) {
    var $__44 = this;
    $traceurRuntime.superCall(this, $ViewerPage.prototype, "constructor", [options]);
    this.$display = this.appendElement('<div class="document-display"/>');
    this.addToSidebar('<a href="#edit"><i class="fa fa-edit"/> Edit</a>');
    this.addToSidebar('<a href="#children"><i class="fa fa-level-down"/> Children</a>');
    this.addActions({
      edit: (function(e) {
        $__44.app.visit(("/edit/" + $__44.doc.uid + "/"));
      }),
      children: (function(e) {
        $__44.app.visit(("/search/?q=Project:" + $__44.doc.uid + "%20OR%20Parent:" + $__44.doc.uid));
      })
    });
  };
  var $ViewerPage = ViewerPage;
  ($traceurRuntime.createClass)(ViewerPage, {onDocumentLoaded: function(doc) {
      $traceurRuntime.superCall(this, $ViewerPage.prototype, "onDocumentLoaded", [doc]);
      this.$display.html(doc.html);
    }}, {}, DocumentPage);
  var ViewerPage = ViewerPage;
  return {get ViewerPage() {
      return ViewerPage;
    }};
});
System.register("pldm/framework/Application", [], function() {
  "use strict";
  var __moduleName = "pldm/framework/Application";
  var Application = function Application(options) {
    this.$element = $(options.element);
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
      this.$element.append(page.$element);
    },
    start: function() {
      var $__47 = this;
      this.visit(location.pathname + location.search).then((function() {
        if ($__47.splash) {
          $($__47.splash).remove();
        }
      }));
    },
    get loading() {
      return this._loading;
    },
    set loading(load) {
      this._loading = load;
      this.$element[load ? 'addClass' : 'removeClass']('loading');
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
          var $__51 = $traceurRuntime.assertObject(pair.split('=')),
              key = $__51[0],
              value = $__51[1];
          params[decodeURIComponent(key)] = decodeURIComponent(value);
        }));
      }
      return {
        path: path,
        params: params
      };
    },
    visit: function(url, pushstate) {
      var $__47 = this;
      var pathInfo = this.parsePath(url);
      if (pushstate !== false) {
        history.pushState(pathInfo.params, null, url);
      }
      var path = pathInfo.path;
      var page = null,
          params = pathInfo.params;
      for (var $__49 = this.routes[Symbol.iterator](),
          $__50; !($__50 = $__49.next()).done; ) {
        var route = $__50.value;
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
        $__47.loading = false;
      }));
    },
    onLinkClick: function(e) {
      var url = $(e.target).attr('href');
      if (url.match(/:\/\//)) {
        return true;
      }
      if (url == '#') {
        return false;
      }
      e.preventDefault();
      this.visit(url);
    }
  }, {});
  var Application = Application;
  return {get Application() {
      return Application;
    }};
});
System.register("pldm/init", [], function() {
  "use strict";
  var __moduleName = "pldm/init";
  var Component = $traceurRuntime.assertObject(System.get("pldm/framework/Component")).Component;
  var Page = $traceurRuntime.assertObject(System.get("pldm/framework/Page")).Page;
  var Application = $traceurRuntime.assertObject(System.get("pldm/framework/Application")).Application;
  var List = $traceurRuntime.assertObject(System.get("pldm/List")).List;
  var Completer = $traceurRuntime.assertObject(System.get("pldm/Completer")).Completer;
  var DocumentEditor = $traceurRuntime.assertObject(System.get("pldm/DocumentEditor")).DocumentEditor;
  var Document = $traceurRuntime.assertObject(System.get("pldm/Document")).Document;
  var EditorPage = $traceurRuntime.assertObject(System.get("pldm/EditorPage")).EditorPage;
  var ViewerPage = $traceurRuntime.assertObject(System.get("pldm/ViewerPage")).ViewerPage;
  var IndexPage = $traceurRuntime.assertObject(System.get("pldm/IndexPage")).IndexPage;
  var PageWithSidebar = $traceurRuntime.assertObject(System.get("pldm/PageWithSidebar")).PageWithSidebar;
  var ListPage = $traceurRuntime.assertObject(System.get("pldm/ListPage")).ListPage;
  var SearchForm = $traceurRuntime.assertObject(System.get("pldm/SearchForm")).SearchForm;
  var pldm = {
    Application: Application,
    Component: Component,
    List: List,
    Page: Page,
    Document: Document,
    Completer: Completer,
    SearchForm: SearchForm,
    DocumentEditor: DocumentEditor,
    PageWithSidebar: PageWithSidebar,
    ListPage: ListPage,
    IndexPage: IndexPage,
    EditorPage: EditorPage,
    ViewerPage: ViewerPage
  };
  window.pldm = pldm;
  $(function() {
    window.AceRange = ace.require('ace/range').Range;
  });
  return {get pldm() {
      return pldm;
    }};
});
System.get("pldm/init" + '');
