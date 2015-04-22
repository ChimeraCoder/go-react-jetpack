js: clean ts
	/usr/lib/node_modules/webpack/bin/webpack.js public/static/js/bin/app.js public/static/js/bin/bundle.js --config webpack.config.js --bail -d

ts: 
	/usr/local/bin/tsc --outDir public/static/js/bin/ typescript/*.ts --target ES6

clean:
	rm -f public/static/js/bin/*.js

