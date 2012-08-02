if (typeof window === 'undefined') {
  var assert = require("assert");
  var additions = require("../index");
}

describe('DOM Additions', function() {

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
    assert.ok(element.style.float == 'left');

    element.setStyle('float:right;');
    assert.ok(element.style.float == 'right');

    element.setStyle({ float: 'none' });
    assert.ok(element.style.float == 'none');
  });

  it('should be able to show and hide an element', function() {
    assert.ok(element.offsetWidth > 0);
    element.hide();
    assert.ok(element.offsetWidth == 0);
    element.show();
    assert.ok(element.offsetWidth > 0);
  });

  it('should be able to manipulate an element\'s class list', function() {
    assert.ok(element.className == '');

    element.addClass('rad');
    assert.ok(element.className == 'rad');
    assert.ok(element.hasClass('rad'));

    element.removeClass('rad');
    assert.ok(element.hasClass('rad') == false);

    element.removeClass('rad');
    assert.ok(element.className == '');

    element.toggleClass('rad');
    assert.ok(element.className == 'rad');

    element.toggleClass('rad');
    assert.ok(element.className == '');
  });
});
