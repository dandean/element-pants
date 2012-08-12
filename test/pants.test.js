var assert;

if (typeof window === 'undefined') {
  assert = require("assert");
}

describe('Element Pants', function() {
  // Currently untested in virtualized DOM environments...
  if (typeof window === 'undefined') return;

  var element;

  beforeEach(function() {
    if (typeof DOM !== 'undefined') DOM.install();

    element = document.createElement('a');
    element.textContent = 'rad';
    element.id = 'rad';
    document.body.appendChild(element);
  });

  afterEach(function() {
    element.parentNode.removeChild(element);
  });

  describe('when used as a Module', function() {
    it('should set styles in various argument formats', function() {
      DOM.setStyle(element, 'float', 'left');
      assert.equal('left', element.style.float || element.style.cssFloat);

      DOM.setStyle(element, 'float:right;');
      assert.equal('right', element.style.float || element.style.cssFloat);

      DOM.setStyle(element, { float: 'none' });
      assert.equal('none', element.style.float || element.style.cssFloat);
    });

    it('should get element styles', function() {
      DOM.setStyle(element, 'float', 'left');
      assert.equal('left', DOM.getStyle(element, 'float'));

      DOM.setStyle(element, 'float', 'right');
      assert.equal('right', DOM.getStyle(element, 'float'));

      DOM.setStyle(element, 'float', 'left');
      assert.equal('left', DOM.getStyle(element, 'float'));
    });

    it('should show and hide an element', function() {
      assert.ok(element.offsetWidth > 0);
      DOM.hide(element);
      assert.equal(0, element.offsetWidth);
      DOM.show(element);
      assert.ok(element.offsetWidth > 0);
    });

    it('should manipulate an element\'s class list', function() {
      assert.equal('', element.className, 'Did not start with an empty className');

      DOM.addClass(element, 'rad');
      assert.equal('rad', element.className, 'Did not set className to "rad"');
      assert.ok(DOM.hasClass(element, 'rad'), 'hasClass did not detect the class');

      DOM.removeClass(element, 'rad');
      assert.equal(false, DOM.hasClass(element, 'rad'), 'hasClass did not remove the class');

      DOM.toggleClass(element, 'rad');
      assert.equal('rad', element.className, 'toggleClass did not add the class');

      DOM.toggleClass(element, 'rad');
      assert.equal('', element.className, 'toggleClass did not remove the class');

      DOM.addClass(element, 'rad cool');
      DOM.addClass(element, 'cool super');
      assert.ok(DOM.hasClass(element, 'rad'), 'addClass did not correctly add multiple classes - rad');
      assert.ok(DOM.hasClass(element, 'cool'), 'addClass did not correctly add multiple classes - cool');
      assert.ok(DOM.hasClass(element, 'super'), 'addClass did not correctly add multiple classes - super');
      assert.equal(element.className.match(/cool/g).length, 1, 'addClass did not correctly add multiple classes - cool should be present once only');

      DOM.removeClass(element, 'rad super');
      assert.equal('cool', element.className, 'removeClass did not correctly add multiple classes');
    });

    it('should bind DOM events', function(done) {
      checkOnBinding();

      function checkOnBinding() {
        DOM.on(element, 'click', function(e) {
          element.click();
          assert.equal(element, this);
          assert.equal('A', element.nodeName);
          DOM.off(element);
          checkDelegatedOnBinding();
        });
        element.click();
      }

      function checkDelegatedOnBinding() {
        DOM.on(document, 'click', element.nodeName.toLowerCase(), function(e) {
          assert.notEqual(document, this);
          assert.equal(element, this);
          assert.equal('A', this.nodeName);
          DOM.off(document);
          checkOffUnbinding();
        });
      }

      function checkOffUnbinding() {
        assert.equal(0, element.__registry__.length);

        var handler1 = function(){};
        var handler2 = function(){};
        DOM.on(element, 'click', handler1);
        assert.equal(1, element.__registry__.length, 'should have bound non-delegated handler');

        DOM.on(element, 'click', handler1);
        assert.equal(2, element.__registry__.length, 'should have bound a 2nd non-delegated handler');

        DOM.off(element, 'click', handler1);
        assert.equal(1, element.__registry__.length, 'should have removed a non-delegated handler');

        DOM.on(element, 'click', 'x', handler2);
        assert.equal(2, element.__registry__.length, 'should have added a delegated handler');

        DOM.off(element, 'click', handler2);
        assert.equal(2, element.__registry__.length, 'should not have removed delegated handler without selector');

        DOM.off(element, 'click', 'x', handler2);
        assert.equal(1, element.__registry__.length, 'should have removed delegated handler with selector');

        DOM.on(element, 'click', handler1);
        DOM.on(element, 'click', handler1);
        DOM.on(element, 'click', handler1);
        DOM.off(element);
        assert.equal(0, element.__registry__.length, 'should have removed all event handlers');

        done();
      }
    });
    
    it('should find an element', function() {
      var x = DOM.find(document, '#rad');
      assert.ok(element === x);

      var y = DOM.findAll(element.parentNode, 'a#rad');
      assert.equal(1, y.length);
      assert.ok(element === y[0]);
    });

    it('should create an element', function() {
      var n1 = DOM.create('a');
      assert.equal('A', n1.tagName);
      assert.equal('<a></a>', n1.outerHTML);

      var n2 = DOM.create('a', 'rad');
      assert.equal('<a>rad</a>', n2.outerHTML);

      var n3 = DOM.create('a', {'rad': 'cool'});
      assert.equal('<a rad="cool"></a>', n3.outerHTML);

      var n4 = DOM.create('a', {'rad': 'cool'}, 'rad');
      assert.equal('<a rad="cool">rad</a>', n4.outerHTML);

      var n5 = DOM.create('a', {'rad': 'cool'}, document.createTextNode('rad'));
      assert.equal('<a rad="cool">rad</a>', n5.outerHTML);

      var n6 = DOM.create('a', document.createElement('span'));
      assert.equal('<a><span></span></a>', n6.outerHTML);
    });
  });

  it('should set styles in various argument formats', function() {
    element.setStyle('float', 'left');
    assert.equal('left', element.style.float || element.style.cssFloat);

    element.setStyle('float:right;');
    assert.equal('right', element.style.float || element.style.cssFloat);

    element.setStyle({ float: 'none' });
    assert.equal('none', element.style.float || element.style.cssFloat);
  });

  it('should get element styles', function() {
    element.setStyle('float', 'left');
    assert.equal('left', element.getStyle('float'));

    element.setStyle('float', 'right');
    assert.equal('right', element.getStyle('float'));

    element.setStyle('float', 'left');
    assert.equal('left', element.getStyle('float'));
  });

  it('should show and hide an element', function() {
    assert.ok(element.offsetWidth > 0);
    element.hide();
    assert.equal(0, element.offsetWidth);
    element.show();
    assert.ok(element.offsetWidth > 0);
  });

  it('should manipulate an element\'s class list', function() {
    assert.equal('', element.className, 'Did not start with an empty className');

    element.addClass('rad');
    assert.equal('rad', element.className, 'Did not set className to "rad"');
    assert.ok(element.hasClass('rad'), 'hasClass did not detect the class');

    element.removeClass('rad');
    assert.equal(false, element.hasClass('rad'), 'hasClass did not remove the class');

    element.toggleClass('rad');
    assert.equal('rad', element.className, 'toggleClass did not add the class');

    element.toggleClass('rad');
    assert.equal('', element.className, 'toggleClass did not remove the class');

    element.addClass('rad cool');
    element.addClass('cool super');
    assert.ok(element.hasClass('rad'), 'addClass did not correctly add multiple classes - rad');
    assert.ok(element.hasClass('cool'), 'addClass did not correctly add multiple classes - cool');
    assert.ok(element.hasClass('super'), 'addClass did not correctly add multiple classes - super');
    assert.equal(element.className.match(/cool/g).length, 1, 'addClass did not correctly add multiple classes - cool should be present once only');

    element.removeClass('rad super');
    assert.equal('cool', element.className, 'removeClass did not correctly add multiple classes');
  });

  it('should bind DOM events', function(done) {
    checkOnBinding();

    function checkOnBinding() {
      element.on('click', function(e) {
        element.click();
        assert.equal(element, this);
        assert.equal('A', element.nodeName);
        element.off();
        checkDelegatedOnBinding();
      });
      element.click();
    }

    function checkDelegatedOnBinding() {
      document.on('click', element.nodeName.toLowerCase(), function(e) {
        assert.notEqual(document, this);
        assert.equal(element, this);
        assert.equal('A', this.nodeName);
        document.off();
        checkOffUnbinding();
      });
    }

    function checkOffUnbinding() {
      assert.equal(0, element.__registry__.length);

      var handler1 = function(){};
      var handler2 = function(){};
      element.on('click', handler1);
      assert.equal(1, element.__registry__.length, 'should have bound non-delegated handler');

      element.on('click', handler1);
      assert.equal(2, element.__registry__.length, 'should have bound a 2nd non-delegated handler');

      element.off('click', handler1);
      assert.equal(1, element.__registry__.length, 'should have removed a non-delegated handler');

      element.on('click', 'x', handler2);
      assert.equal(2, element.__registry__.length, 'should have added a delegated handler');

      element.off('click', handler2);
      assert.equal(2, element.__registry__.length, 'should not have removed delegated handler without selector');

      element.off('click', 'x', handler2);
      assert.equal(1, element.__registry__.length, 'should have removed delegated handler with selector');

      element.on('click', handler1);
      element.on('click', handler1);
      element.on('click', handler1);
      element.off();
      assert.equal(0, element.__registry__.length, 'should have removed all event handlers');

      done();
    }
  });
  
  it('should find an element', function() {
    var x = document.find('#rad');
    assert.ok(element === x);

    var y = element.parentNode.findAll('a#rad');
    assert.equal(1, y.length);
    assert.ok(element === y[0]);
  });

  it('should create an element', function() {
    var n1 = document.create('a');
    assert.equal('A', n1.tagName);
    assert.equal('<a></a>', n1.outerHTML);

    var n2 = document.create('a', 'rad');
    assert.equal('<a>rad</a>', n2.outerHTML);

    var n3 = document.create('a', {'rad': 'cool'});
    assert.equal('<a rad="cool"></a>', n3.outerHTML);

    var n4 = document.create('a', {'rad': 'cool'}, 'rad');
    assert.equal('<a rad="cool">rad</a>', n4.outerHTML);

    var n5 = document.create('a', {'rad': 'cool'}, document.createTextNode('rad'));
    assert.equal('<a rad="cool">rad</a>', n5.outerHTML);

    var n6 = document.create('a', document.createElement('span'));
    assert.equal('<a><span></span></a>', n6.outerHTML);
  });

});
