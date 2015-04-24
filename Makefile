js: clean
	/usr/local/bin/webpack typescript/app.js public/static/js/bin/bundle.js --config webpack.config.js --bail

ts: 
	/usr/local/bin/tsc --outDir public/static/js/bin/ typescript/*.ts --module amd

clean:
	rm -f public/static/js/bin/*.js

