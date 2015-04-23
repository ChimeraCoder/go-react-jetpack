js: clean flow
	/usr/local/bin/webpack js/app.js public/static/js/bin/bundle.js --config webpack.config.js --bail

ts: 
	/usr/local/bin/tsc --outDir public/static/js/bin/ typescript/*.ts --module amd

flow:
	cat js/*.js | flow check-contents

clean:
	rm -f public/static/js/bin/*.js

