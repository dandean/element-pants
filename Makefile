REPORTER = dot

test:
	./node_modules/.bin/mocha \
	  && open ./test/html/requirejs.html \
	  && open ./test/html/script.html

.PHONY: test
