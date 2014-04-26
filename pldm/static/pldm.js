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
      this.text = data.text || '';
      this.url = data.url;
      this.html = data.html;
      this.title = data.title;
    },
    getHeader: function(key) {
      var header = this.headers[key.toLowerCase()];
      return header ? header.value : null;
    },
    get number() {
      return this.getHeader('number');
    },
    get label() {
      return this._label || ("#" + this.number + ": " + this.getHeader('summary'));
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
      var url = this.url || this.collectionUrl;
      if (!url) {
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
      console.log(e.target);
      var $el = $(e.target);
      console.log($el.data());
      if ($el.length == 0) {
        return;
      }
      var index = $el.data(ITEM_INDEX_DATA_KEY);
      console.log(index);
      this.select(index);
      this.emit('select');
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
      $.ajax(url, {
        success: this.onLoadSuccess.bind(this),
        error: this.onLoadError.bind(this),
        dataType: 'json'
      });
    },
    onLoadError: function() {
      console.log('error getting items', arguments);
    },
    onLoadSuccess: function(result) {
      this.clear();
      for (var $__10 = result.documents[Symbol.iterator](),
          $__11; !($__11 = $__10.next()).done; ) {
        var data = $__11.value;
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
System.register("pldm/Completer", [], function() {
  "use strict";
  var __moduleName = "pldm/Completer";
  var List = $traceurRuntime.assertObject(System.get("pldm/List")).List;
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
    this.dropdownList.on('select', (function() {
      this.complete();
      this.editor.focus();
    }).bind(this));
    editor.container.ownerDocument.body.appendChild(this.dropdownList.element);
    this.install();
  };
  ($traceurRuntime.createClass)(Completer, {
    install: function() {
      var session = this.editor.getSession();
      session.selection.on('changeCursor', this.onCursorChange.bind(this));
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
          left: coords.pageX - 3 + 'px',
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
    complete: function() {
      var s = this.dropdownList.getSelection();
      var session = this.editor.getSession();
      console.log(s);
      session.replace(this.focusedToken.range, s.label);
      this.deactivate();
    },
    onCommandKey: function(e, hashId, keyCode) {
      if (!this.focusedToken) {
        return this.boundEditorOnCommandKey(e, hashId, keyCode);
      }
      switch (keyCode) {
        case 9:
          var s = this.dropdownList.getSelection();
          if (s) {
            this.complete();
          } else {
            this.editor.blur();
          }
          break;
        case 13:
          if (!this.dropdownList.getSelection()) {
            this.deactivate();
            return this.boundEditorOnCommandKey(e, hashId, keyCode);
          }
          this.complete();
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
    var aceWrapper = $('<div style="width:600px"/>');
    this.$element.append(aceWrapper);
    var editor = this.editor = ace.edit(aceWrapper.get(0));
    editor.setOptions({maxLines: Infinity});
    editor.setTheme("ace/theme/github");
    editor.setHighlightActiveLine(false);
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
      this.doc.save();
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
      this.show();
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
    this.$header = this.appendElement('<h1/>');
  };
  var $DocumentPage = DocumentPage;
  ($traceurRuntime.createClass)(DocumentPage, {
    onLoadError: function() {
      console.log("error", arguments);
    },
    onDocumentLoaded: function(doc) {
      console.log("document loaded", doc);
      this.doc = doc;
      this.$header.html((doc.label + ": " + doc.title));
    },
    open: function(params) {
      $.ajax('/api/document/' + params.uid + '/', {
        type: 'GET',
        error: this.onLoadError.bind(this),
        success: (function(data) {
          var doc = new Document(data);
          this.onDocumentLoaded(doc);
        }).bind(this)
      });
      $traceurRuntime.superCall(this, $DocumentPage.prototype, "open", [params]);
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
    $traceurRuntime.superCall(this, $EditorPage.prototype, "constructor", [options]);
    this.addToSidebar($('<a href="#save">Save</a>'));
    this.addToSidebar($('<a href="#cancel">Cancel</a>'));
    this.editor = new DocumentEditor({});
    this.$element.append(this.editor.$element);
    this.addActions({
      cancel: function(e) {
        if (this.doc.uid) {
          this.app.visit(("/view/" + this.doc.uid + "/"));
        } else {
          this.app.visit('/');
        }
      },
      save: function(e) {
        console.log("SAVE");
        this.editor.save();
      }
    });
  };
  var $EditorPage = EditorPage;
  ($traceurRuntime.createClass)(EditorPage, {onDocumentLoaded: function(doc) {
      $traceurRuntime.superCall(this, $EditorPage.prototype, "onDocumentLoaded", [doc]);
      this.editor.setDocument(doc);
      this.editor.focus();
    }}, {}, DocumentPage);
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
    this.addToSidebar($('<a href="/create/">Create</a>'));
    this.addToSidebar($('<a href="/list/">Search</a>'));
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
  var Document = $traceurRuntime.assertObject(System.get("pldm/Document")).Document;
  var List = $traceurRuntime.assertObject(System.get("pldm/List")).List;
  var ListPage = function ListPage(options) {
    _.defaults(options, {cssClass: 'pldm-search'});
    $traceurRuntime.superCall(this, $ListPage.prototype, "constructor", [options]);
    this.list = new List({render: function(item) {
        var doc = item.data;
        return $(("<li><a href=\"/view/" + doc.uid + "/\">" + doc.label + ": " + doc.title + "</a></li>"));
      }});
    this.$element.append(this.list.$element);
  };
  var $ListPage = ListPage;
  ($traceurRuntime.createClass)(ListPage, {open: function(params) {
      this.list.load('/api/documents/');
      $traceurRuntime.superCall(this, $ListPage.prototype, "open", [params]);
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
    $traceurRuntime.superCall(this, $ViewerPage.prototype, "constructor", [options]);
    this.$display = this.appendElement('<div class="document-display"/>');
    this.addToSidebar('<a href="#edit">Edit</a>');
    this.addActions({edit: function() {
        this.app.visit(("/edit/" + this.doc.uid + "/"));
      }});
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
    this.currentPage = null;
    $('body').on('click', 'a', this.onLinkClick.bind(this));
    $(window).on('popstate', this.onHistoryChange.bind(this));
    this.routes = [];
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
      this.visit(location.pathname);
    },
    visit: function(path) {
      var page = null,
          params = null;
      for (var $__32 = this.routes[Symbol.iterator](),
          $__33; !($__33 = $__32.next()).done; ) {
        var route = $__33.value;
        {
          var match = route.re.exec(path);
          if (match) {
            page = route.page;
            params = _.zipObject(route.params, match);
            break;
          }
        }
      }
      console.log(page, params);
      if (!page) {
        throw new Error(("404: " + path));
      }
      if (this.currentPage !== page) {
        if (this.currentPage) {
          this.currentPage.close();
        }
        this.currentPage = page;
      }
      page.open(params);
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
      console.log("push state");
      history.pushState(null, null, url);
      this.visit(url);
    },
    onHistoryChange: function() {
      this.visit(location.pathname);
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
  var pldm = {
    Application: Application,
    Component: Component,
    List: List,
    Page: Page,
    Completer: Completer,
    Document: Document,
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
