/* eslint-disable */

let fs = require('fs')

let files = fs.readdirSync('./src/locales/');

files = files.filter((x) => /[a-z0-9]+\.json$/i.test(x));

let obj = {};

files.forEach((file) => {
	let context = require('./src/locales/' + file);
	Object.assign(obj, context);
});

files.forEach((file) => {
	let context = require('./src/locales/' + file);
	for (let key in obj) {
		if (!context.hasOwnProperty(key)) {
			context[key] = '';
			console.log(`Add key '${key}' in file '${file}'`);
		}
	}
	fs.writeFileSync('./src/locales/' + file, JSON.stringify(context, null, '\t'));
});