;(function() {
  'use strict';

  function camelize(string) {
    return string.replace(/-+(.)?/g, function(match, chr) {
      return chr ? chr.toUpperCase() : '';
    });
  }

  function isString(value) {
    return Object.prototype.toString.call(value) === '[object String]';
  }

  function isUndefined(value) {
    return void(0) === value
  }

  var slice = Array.prototype.slice;

  var styleSheetElement;

  var Extensions = {

    hasClass: function(className) {
      var value = this.className;
      return (value.length > 0
        && (value == className || new RegExp("(^|\\s)" + className + "(\\s|$)").test(value)));
    },

    addClass: function(className) {
      if (!Extensions.hasClass.call(this, className))
        this.className += (this.className ? ' ' : '') + className;
      return this;
    },

    removeClass: function(className) {
      this.className = this.className.replace(
        new RegExp("(^|\\s+)" + className + "(\\s+|$)"), ' ').trim();
      return this;
    },

    toggleClass: function(className) {
      return Extensions[
        Extensions.hasClass.call(this, className) ? 'removeClass' : 'addClass'
      ].call(this, className);
    },

    getStyle: function(style) {
      style = style == 'float' ? 'cssFloat' : camelize(style);
      var value = this.style[style];
      if (!value || value == 'auto') {
        var css = window.getComputedStyle(this, null);
        value = css ? css[style] : null;
      }
      if (style == 'opacity') return value ? parseFloat(value) : 1.0;
      return value == 'auto' ? null : value;
    },

    setStyle: function(name, value) {
      var styles;

      if (arguments.length == 2) {
        styles = name + ':' + value + ';';

      } else if (arguments.length == 1 && isString(name)) {
        styles = name;
      }

      var style = this.style;

      if (styles) {
        style.cssText += ';' + styles;
        return this;
      }

      styles = name;
      for (var property in styles)
        style[
          (property == 'float' || property == 'cssFloat')
            ? (isUndefined(style.styleFloat) ? 'cssFloat' : 'styleFloat')
            : property
        ] = styles[property];

      return this;
    },

    hide: function() {
      if (!styleSheetElement) {
        styleSheetElement = document.createElement('style');
        styleSheetElement.setAttribute('type', 'text/css');
        var rule = '[data-dom-hidden] { display:none !important; }';
        if (styleSheetElement.styleSheet) {
          styleSheetElement.styleSheet.cssText = rule;
        } else styleSheetElement.textContent = rule;
        (document.head || document.getElementsByTagName('head')[0])
          .appendChild(styleSheetElement)
      }
      this.setAttribute('data-dom-hidden', 'true');
      return this;
    },

    show: function() {
      this.removeAttribute('data-dom-hidden');
      return this;
    }
  };

  var Module = {

    /**
     * install([debug]) -> undefined
     * - debug (Boolean): If debug messages should printed when a function is installed on DOM objects.
     *
     * Installs all module functions (except Module.install) on `Element.prototype`.
    **/
    install: function(debug) {
      if (typeof Element == "undefined") {
        if (debug && console) console.log('DOM Additions could not be installed -- no Element object host.');
        return;
      }

      Object.keys(Extensions).forEach(function(method) {
        if (!Element.prototype.hasOwnProperty(method)) {
          Object.defineProperty(Element.prototype, method, {
            value: Extensions[method],
            enumerable: false, configurable: true, writable: true
          });
          if (debug && console) console.log("Installed Element#" + method + "()");
        }
      });
    }
  };

  // Copy methods over to the Module object.
  Object.keys(Extensions).forEach(function(method) {
    Module[method] = function(element, args) {
      return Extensions[method].apply(element, slice.call(arguments, 1));
    }
  });

  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    // RequireJS
    define(function() { return Module; });

  } else if (typeof module == 'object') {
    // CommonJS
    module.exports = Module;

  } else if (typeof window == 'object') {
    // No module system
    Module.install();
  }

}(this));
