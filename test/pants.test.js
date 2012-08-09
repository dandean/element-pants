if (typeof window === 'undefined') {
  var assert = require("assert");
  var pants = require("../index");
}

describe('Element Pants', function() {
  // Currently untested in virtualized DOM environments...
  if (typeof window === 'undefined') return;

  var element;

  before(function() {
  	if (typeof DOM !== 'undefined') DOM.install();
    element = document.createElement('a');
    element.textContent = 'rad';
    document.body.appendChild(element);
  });

  after(function() {
    element.parentNode.removeChild(element);
  });

  it('should allow setting styles in various argument formats', function() {
    element.setStyle('float', 'left');
    assert.equal('left', element.style.float || element.style.cssFloat);

    element.setStyle('float:right;');
    assert.equal('right', element.style.float || element.style.cssFloat);

    element.setStyle({ float: 'none' });
    assert.equal('none', element.style.float || element.style.cssFloat);
  });

  it('should be able to show and hide an element', function() {
    assert.ok(element.offsetWidth > 0);
    element.hide();
    assert.equal(0, element.offsetWidth);
    element.show();
    assert.ok(element.offsetWidth > 0);
  });

  it('should be able to manipulate an element\'s class list', function() {
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
      element.click();
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
});
