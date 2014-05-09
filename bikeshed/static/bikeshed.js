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
System.register("bikeshed/Collection", [], function() {
  "use strict";
  var __moduleName = "bikeshed/Collection";
  var EventEmitter = $traceurRuntime.assertObject(System.get("EventEmitter")).EventEmitter;
  var Collection = function Collection(items) {
    this.items = items || [];
  };
  ($traceurRuntime.createClass)(Collection, {}, {}, EventEmitter);
  var Collection = Collection;
  return {get Collection() {
      return Collection;
    }};
});
System.register("bikeshed/framework/Model", [], function() {
  "use strict";
  var __moduleName = "bikeshed/framework/Model";
  var EventEmitter = $traceurRuntime.assertObject(System.get("EventEmitter")).EventEmitter;
  var Model = function Model(data, options) {
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
  var Model = Model;
  return {get Model() {
      return Model;
    }};
});
System.register("bikeshed/Document", [], function() {
  "use strict";
  var __moduleName = "bikeshed/Document";
  var Model = $traceurRuntime.assertObject(System.get("bikeshed/framework/Model")).Model;
  var Document = function Document() {
    $traceurRuntime.defaultSuperCall(this, $Document.prototype, arguments);
  };
  var $Document = Document;
  ($traceurRuntime.createClass)(Document, {
    load: function(data) {
      this.headers = {};
      if (data.headers) {
        for (var $__5 = data.headers[Symbol.iterator](),
            $__6; !($__6 = $__5.next()).done; ) {
          var attr = $__6.value;
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
  var Document = Document;
  return {get Document() {
      return Document;
    }};
});
System.register("bikeshed/framework/Component", [], function() {
  "use strict";
  var __moduleName = "bikeshed/framework/Component";
  var EventEmitter = $traceurRuntime.assertObject(System.get("EventEmitter")).EventEmitter;
  var ACTIONS_DATA_KEY = 'bikeshed-component-actions';
  var Component = function Component(options) {
    options = options || {};
    $traceurRuntime.superCall(this, $Component.prototype, "constructor", []);
    this.$element = $('<div class="bikeshed-component"></div>');
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
      var $__8 = this;
      _.each(mapping, (function(handler, name) {
        return $__8.addAction(name, handler);
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
System.register("bikeshed/List", [], function() {
  "use strict";
  var __moduleName = "bikeshed/List";
  var Component = $traceurRuntime.assertObject(System.get("bikeshed/framework/Component")).Component;
  var Document = $traceurRuntime.assertObject(System.get("bikeshed/Document")).Document;
  var ITEM_INDEX_DATA_KEY = 'bikeshed-list-item-index';
  var List = function List(options) {
    options = _.defaults(options, {cssClass: 'bikeshed-list'});
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
      var $__11 = this,
          $__12 = arguments;
      return this.resource.get(options).then((function(result) {
        $__11.onLoadSuccess(result);
      })).catch((function() {
        $__11.onLoadError.apply($__11, $__12);
      }));
    },
    onLoadError: function() {
      console.log('error getting items', arguments);
    },
    onLoadSuccess: function(result) {
      this.clear();
      for (var $__14 = result.documents[Symbol.iterator](),
          $__15; !($__15 = $__14.next()).done; ) {
        var data = $__15.value;
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
System.register("bikeshed/SearchForm", [], function() {
  "use strict";
  var __moduleName = "bikeshed/SearchForm";
  var Component = $traceurRuntime.assertObject(System.get("bikeshed/framework/Component")).Component;
  var Document = $traceurRuntime.assertObject(System.get("bikeshed/Document")).Document;
  var SearchForm = function SearchForm(options) {
    options = _.defaults(options, {cssClass: 'bikeshed-searchform'});
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
      var $__17 = this;
      if (this.typingTimeout) {
        clearTimeout(this.typingTimeout);
        this.typingTimeout = null;
      }
      this.typingTimeout = setTimeout((function() {
        $__17.onQueryChange($__17.query);
        $__17.typingTimeout = null;
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
System.register("bikeshed/Picker", [], function() {
  "use strict";
  var __moduleName = "bikeshed/Picker";
  var Component = $traceurRuntime.assertObject(System.get("bikeshed/framework/Component")).Component;
  var List = $traceurRuntime.assertObject(System.get("bikeshed/List")).List;
  var SearchForm = $traceurRuntime.assertObject(System.get("bikeshed/SearchForm")).SearchForm;
  var Picker = function Picker(options) {
    _.defaults(options, {cssClass: 'bikeshed-picker'});
    $traceurRuntime.superCall(this, $Picker.prototype, "constructor", [options]);
    this.resource = options.resource;
    this.searchForm = new SearchForm({});
    this.$element.append(this.searchForm.$element);
    this.searchForm.on('change', this.onSearchChange.bind(this));
    this.searchForm.$input.on('keydown', this.onSearchInputKeyDown.bind(this));
    this.list = new List({
      resource: this.resource,
      render: function(item) {
        var doc = item.data;
        var type = doc.getHeader('Type', '');
        var label = doc.label[0] == '#' ? (doc.label + ":") : '';
        var title = label ? doc.title : doc.label;
        return $(("<li><b>" + label + " </b>" + title + "<span class=\"type\">" + type + "</span></li>"));
      }
    });
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
  var Picker = Picker;
  return {get Picker() {
      return Picker;
    }};
});
System.register("bikeshed/framework/Popup", [], function() {
  "use strict";
  var __moduleName = "bikeshed/framework/Popup";
  var Component = $traceurRuntime.assertObject(System.get("bikeshed/framework/Component")).Component;
  var Popup = function Popup(options) {
    var $__22 = this;
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
        $__22.close();
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
System.register("bikeshed/Completer", [], function() {
  "use strict";
  var __moduleName = "bikeshed/Completer";
  var List = $traceurRuntime.assertObject(System.get("bikeshed/List")).List;
  var Popup = $traceurRuntime.assertObject(System.get("bikeshed/framework/Popup")).Popup;
  var Picker = $traceurRuntime.assertObject(System.get("bikeshed/Picker")).Picker;
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
    this.install();
  };
  ($traceurRuntime.createClass)(Completer, {
    install: function() {
      var $__25 = this;
      var session = this.editor.getSession();
      session.selection.on('changeCursor', (function() {
        setTimeout($__25.onCursorChange.bind($__25), 1);
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
      var $__25 = this;
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
              $__25.complete(doc);
              popup.dispose();
            }));
            popup.on('dispose', (function() {
              $__25.editor.focus();
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
System.register("bikeshed/DocumentEditor", [], function() {
  "use strict";
  var __moduleName = "bikeshed/DocumentEditor";
  var Component = $traceurRuntime.assertObject(System.get("bikeshed/framework/Component")).Component;
  var Document = $traceurRuntime.assertObject(System.get("bikeshed/Document")).Document;
  var Completer = $traceurRuntime.assertObject(System.get("bikeshed/Completer")).Completer;
  var DocumentEditor = function DocumentEditor(options) {
    options = _.defaults(options, {'cssClass': 'bikeshed-editor'});
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
      resource: options.resource
    });
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
  var DocumentEditor = DocumentEditor;
  return {get DocumentEditor() {
      return DocumentEditor;
    }};
});
System.register("bikeshed/framework/Page", [], function() {
  "use strict";
  var __moduleName = "bikeshed/framework/Page";
  var Component = $traceurRuntime.assertObject(System.get("bikeshed/framework/Component")).Component;
  var Page = function Page(options) {
    options = _.defaults(options, {cssClass: 'bikeshed-page'});
    $traceurRuntime.superCall(this, $Page.prototype, "constructor", [options]);
    this.hide();
  };
  var $Page = Page;
  ($traceurRuntime.createClass)(Page, {
    open: function(params) {
      var $__30 = this;
      return new Promise((function(resolve, reject) {
        $__30.show();
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
System.register("bikeshed/PageWithSidebar", [], function() {
  "use strict";
  var __moduleName = "bikeshed/PageWithSidebar";
  var Page = $traceurRuntime.assertObject(System.get("bikeshed/framework/Page")).Page;
  var PageWithSidebar = function PageWithSidebar(options) {
    $traceurRuntime.superCall(this, $PageWithSidebar.prototype, "constructor", [options]);
    this.$sidebar = this.appendElement('<div class="bikeshed-sidebar"/>');
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
System.register("bikeshed/DocumentPage", [], function() {
  "use strict";
  var __moduleName = "bikeshed/DocumentPage";
  var PageWithSidebar = $traceurRuntime.assertObject(System.get("bikeshed/PageWithSidebar")).PageWithSidebar;
  var Document = $traceurRuntime.assertObject(System.get("bikeshed/Document")).Document;
  var DocumentPage = function DocumentPage(options) {
    $traceurRuntime.superCall(this, $DocumentPage.prototype, "constructor", [options]);
    this.resource = options.resource;
    this.$path = this.appendElement('<div class="path"/>');
    this.$header = this.appendElement('<h1/>');
  };
  var $DocumentPage = DocumentPage;
  ($traceurRuntime.createClass)(DocumentPage, {
    onDocumentLoaded: function(doc) {
      var $__35 = this;
      this.doc = doc;
      this.$header.html((doc.label + ": " + doc.title));
      this.$path.empty();
      _.each(doc.path, (function(parent) {
        $__35.$path.append(parent.createViewLink());
        $__35.$path.append($('<b> / </b>'));
      }));
    },
    open: function(params) {
      var $__36 = this;
      var $__35 = this;
      var done = null;
      if (params.uid) {
        done = this.resource.fetch(params.uid).then((function(doc) {
          $__35.onDocumentLoaded(doc);
        }));
      }
      done = done ? done.then((function() {
        return $traceurRuntime.superCall($__36, $DocumentPage.prototype, "open", [params]);
      })) : $traceurRuntime.superCall(this, $DocumentPage.prototype, "open", [params]);
      return done;
    }
  }, {}, PageWithSidebar);
  var DocumentPage = DocumentPage;
  return {get DocumentPage() {
      return DocumentPage;
    }};
});
System.register("bikeshed/EditorPage", [], function() {
  "use strict";
  var __moduleName = "bikeshed/EditorPage";
  var DocumentPage = $traceurRuntime.assertObject(System.get("bikeshed/DocumentPage")).DocumentPage;
  var Document = $traceurRuntime.assertObject(System.get("bikeshed/Document")).Document;
  var DocumentEditor = $traceurRuntime.assertObject(System.get("bikeshed/DocumentEditor")).DocumentEditor;
  var EditorPage = function EditorPage(options) {
    var $__38 = this;
    $traceurRuntime.superCall(this, $EditorPage.prototype, "constructor", [options]);
    this.addToSidebar($('<a href="#save"><i class="fa fa-check"/>Save</a>'));
    this.addToSidebar($('<a href="#cancel"><i class="fa fa-times"/>Cancel</a>'));
    this.editor = new DocumentEditor({resource: this.resource});
    this.$element.append(this.editor.$element);
    this.addActions({
      cancel: (function(e) {
        if ($__38.doc.uid) {
          $__38.app.visit(("/view/" + $__38.doc.uid + "/"));
        } else {
          $__38.app.visit('/');
        }
      }),
      save: (function(e) {
        $__38.editor.save();
      })
    });
    this.editor.on('save', (function(doc) {
      $__38.resource.save(doc).then((function(doc) {
        console.log("postsave", doc);
        $__38.app.visit(("/view/" + doc.uid + "/"));
      }));
    }));
  };
  var $EditorPage = EditorPage;
  ($traceurRuntime.createClass)(EditorPage, {
    onDocumentLoaded: function(doc) {
      $traceurRuntime.superCall(this, $EditorPage.prototype, "onDocumentLoaded", [doc]);
      this.editor.setDocument(doc);
    },
    open: function(params) {
      var $__38 = this;
      return $traceurRuntime.superCall(this, $EditorPage.prototype, "open", [params]).then((function(doc) {
        return $__38.editor.focus();
      }));
    }
  }, {}, DocumentPage);
  var EditorPage = EditorPage;
  return {get EditorPage() {
      return EditorPage;
    }};
});
System.register("bikeshed/IndexPage", [], function() {
  "use strict";
  var __moduleName = "bikeshed/IndexPage";
  var PageWithSidebar = $traceurRuntime.assertObject(System.get("bikeshed/PageWithSidebar")).PageWithSidebar;
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
System.register("bikeshed/ListPage", [], function() {
  "use strict";
  var __moduleName = "bikeshed/ListPage";
  var PageWithSidebar = $traceurRuntime.assertObject(System.get("bikeshed/PageWithSidebar")).PageWithSidebar;
  var Picker = $traceurRuntime.assertObject(System.get("bikeshed/Picker")).Picker;
  var ListPage = function ListPage(options) {
    var $__43 = this;
    _.defaults(options, {cssClass: 'bikeshed-search'});
    $traceurRuntime.superCall(this, $ListPage.prototype, "constructor", [options]);
    this.resource = options.resource;
    this.picker = new Picker({resource: this.resource});
    this.$element.append(this.picker.$element);
    this.picker.on('select', (function(doc) {
      $__43.app.visit(("/view/" + doc.uid + "/"));
    }));
  };
  var $ListPage = ListPage;
  ($traceurRuntime.createClass)(ListPage, {open: function(params) {
      var $__43 = this;
      this.picker.query = params.q || '';
      return $traceurRuntime.superCall(this, $ListPage.prototype, "open", [params]).then((function() {
        return $__43.picker.focus();
      }));
    }}, {}, PageWithSidebar);
  var ListPage = ListPage;
  return {get ListPage() {
      return ListPage;
    }};
});
System.register("bikeshed/LoginPage", [], function() {
  "use strict";
  var __moduleName = "bikeshed/LoginPage";
  var Page = $traceurRuntime.assertObject(System.get("bikeshed/framework/Page")).Page;
  var LoginPage = function LoginPage(options) {
    var $__46 = this;
    options = _.defaults(options, {cssClass: 'bikeshed-login'});
    $traceurRuntime.superCall(this, $LoginPage.prototype, "constructor", [options]);
    this.api = options.api;
    var $loginForm = $('<div class="bikeshed-login"/>');
    this.$usernameInput = $('<input type="text" placeholder="Username"/>');
    this.$passwordInput = $('<input type="password" placeholder="Password"/>');
    $loginForm.append(this.$usernameInput, this.$passwordInput);
    this.$element.append($loginForm);
    this.$passwordInput.on('keypress', (function(e) {
      if (e.keyCode == 13) {
        $__46.submit();
        return false;
      }
    }));
  };
  var $LoginPage = LoginPage;
  ($traceurRuntime.createClass)(LoginPage, {
    open: function(params) {
      var $__46 = this;
      return $traceurRuntime.superCall(this, $LoginPage.prototype, "open", [params]).then((function() {
        return $__46.$usernameInput.focus();
      }));
    },
    submit: function() {
      var $__46 = this;
      var credentials = {
        username: this.$usernameInput.val(),
        password: this.$passwordInput.val()
      };
      this.api.post('/authenticate/', {
        dataType: 'json',
        data: JSON.stringify(credentials)
      }).then((function(response) {
        $__46.api.setDefaultHeader('Authorization', 'session ' + response.session_key);
        $__46.app.visit('/');
      }));
    }
  }, {}, Page);
  var LoginPage = LoginPage;
  return {get LoginPage() {
      return LoginPage;
    }};
});
System.register("bikeshed/ViewerPage", [], function() {
  "use strict";
  var __moduleName = "bikeshed/ViewerPage";
  var DocumentPage = $traceurRuntime.assertObject(System.get("bikeshed/DocumentPage")).DocumentPage;
  var Document = $traceurRuntime.assertObject(System.get("bikeshed/Document")).Document;
  var ViewerPage = function ViewerPage(options) {
    var $__49 = this;
    $traceurRuntime.superCall(this, $ViewerPage.prototype, "constructor", [options]);
    this.$display = this.appendElement('<div class="document-display"/>');
    this.addToSidebar('<a href="#edit"><i class="fa fa-edit"/> Edit</a>');
    this.addToSidebar('<a href="#children"><i class="fa fa-level-down"/> Children</a>');
    this.addActions({
      edit: (function(e) {
        $__49.app.visit(("/edit/" + $__49.doc.uid + "/"));
      }),
      children: (function(e) {
        $__49.app.visit(("/search/?q=Project:" + $__49.doc.uid + "%20OR%20Parent:" + $__49.doc.uid));
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
System.register("bikeshed/framework/API", [], function() {
  "use strict";
  var __moduleName = "bikeshed/framework/API";
  var EventEmitter = $traceurRuntime.assertObject(System.get("EventEmitter")).EventEmitter;
  var API = function API(options) {
    $traceurRuntime.superCall(this, $API.prototype, "constructor", []);
    options = _.defaults(options, {
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
    request: function(url, options) {
      var $__52 = this;
      if (!options.absolute) {
        url = this.baseUrl + url;
      }
      options = _.defaults(options, {
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
            $__52.emit('unauthorizedRequest', xhr);
          } else {
            console.log("ERROR", status, error, xhr);
          }
          reject();
        });
        $.ajax(url, options);
      }));
    },
    post: function(url, options) {
      options = _.defaults(options, {type: 'POST'});
      return this.request(url, options);
    }
  }, {}, EventEmitter);
  var API = API;
  return {get API() {
      return API;
    }};
});
System.register("bikeshed/framework/Application", [], function() {
  "use strict";
  var __moduleName = "bikeshed/framework/Application";
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
      var $__55 = this;
      this.visit(location.pathname + location.search).then((function() {
        if ($__55.splash) {
          $($__55.splash).remove();
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
          var $__59 = $traceurRuntime.assertObject(pair.split('=')),
              key = $__59[0],
              value = $__59[1];
          params[decodeURIComponent(key)] = decodeURIComponent(value);
        }));
      }
      return {
        path: path,
        params: params
      };
    },
    visit: function(url, pushstate) {
      var $__55 = this;
      console.log("VISIT", url);
      var pathInfo = this.parsePath(url);
      if (pushstate !== false) {
        history.pushState(pathInfo.params, null, url);
      }
      var path = pathInfo.path;
      var page = null,
          params = pathInfo.params;
      for (var $__57 = this.routes[Symbol.iterator](),
          $__58; !($__58 = $__57.next()).done; ) {
        var route = $__58.value;
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
        $__55.loading = false;
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
  }, {});
  var Application = Application;
  return {get Application() {
      return Application;
    }};
});
System.register("bikeshed/framework/Resource", [], function() {
  "use strict";
  var __moduleName = "bikeshed/framework/Resource";
  var EventEmitter = $traceurRuntime.assertObject(System.get("EventEmitter")).EventEmitter;
  var Resource = function Resource(api, url, model, options) {
    this.api = api;
    this.url = url;
    this.model = model;
  };
  ($traceurRuntime.createClass)(Resource, {
    request: function(options) {
      console.log(options);
      return this.api.request(options.url || this.url, options);
    },
    get: function(options) {
      options = _.defaults(options, {type: 'GET'});
      return this.request(options);
    },
    post: function(options) {
      options = _.defaults({type: 'POST'});
      return this.request(options);
    },
    fetch: function(id, options) {
      var $__60 = this;
      options = _.defaults(options || {}, {url: ("" + this.url + id + "/")});
      console.log('fetch', id, options);
      return this.get(options).then((function(data) {
        return new $__60.model(data);
      }));
    },
    save: function(model, options) {
      options = options || {};
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
  var Resource = Resource;
  return {get Resource() {
      return Resource;
    }};
});
System.register("bikeshed/init", [], function() {
  "use strict";
  var __moduleName = "bikeshed/init";
  var Component = $traceurRuntime.assertObject(System.get("bikeshed/framework/Component")).Component;
  var Page = $traceurRuntime.assertObject(System.get("bikeshed/framework/Page")).Page;
  var Application = $traceurRuntime.assertObject(System.get("bikeshed/framework/Application")).Application;
  var API = $traceurRuntime.assertObject(System.get("bikeshed/framework/API")).API;
  var Resource = $traceurRuntime.assertObject(System.get("bikeshed/framework/Resource")).Resource;
  var Model = $traceurRuntime.assertObject(System.get("bikeshed/framework/Model")).Model;
  var Collection = $traceurRuntime.assertObject(System.get("bikeshed/Collection")).Collection;
  var List = $traceurRuntime.assertObject(System.get("bikeshed/List")).List;
  var Completer = $traceurRuntime.assertObject(System.get("bikeshed/Completer")).Completer;
  var DocumentEditor = $traceurRuntime.assertObject(System.get("bikeshed/DocumentEditor")).DocumentEditor;
  var Document = $traceurRuntime.assertObject(System.get("bikeshed/Document")).Document;
  var EditorPage = $traceurRuntime.assertObject(System.get("bikeshed/EditorPage")).EditorPage;
  var ViewerPage = $traceurRuntime.assertObject(System.get("bikeshed/ViewerPage")).ViewerPage;
  var IndexPage = $traceurRuntime.assertObject(System.get("bikeshed/IndexPage")).IndexPage;
  var PageWithSidebar = $traceurRuntime.assertObject(System.get("bikeshed/PageWithSidebar")).PageWithSidebar;
  var ListPage = $traceurRuntime.assertObject(System.get("bikeshed/ListPage")).ListPage;
  var LoginPage = $traceurRuntime.assertObject(System.get("bikeshed/LoginPage")).LoginPage;
  var SearchForm = $traceurRuntime.assertObject(System.get("bikeshed/SearchForm")).SearchForm;
  var bikeshed = {
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
    ViewerPage: ViewerPage,
    LoginPage: LoginPage
  };
  bikeshed.framework = {
    API: API,
    Collection: Collection,
    Model: Model,
    Resource: Resource
  };
  window.bikeshed = bikeshed;
  $(function() {
    window.AceRange = ace.require('ace/range').Range;
  });
  return {get bikeshed() {
      return bikeshed;
    }};
});
System.get("bikeshed/init" + '');
