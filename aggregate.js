const prom = require('util').promisify;
const fs = require('fs');
const readDir = prom(fs.readdir);
const readFile = prom(fs.readFile);
const writeFile = prom(fs.writeFile);
const path = require('path');

module.exports = function(inputDir, output) {
	var results = [];
	return readDir(inputDir).then(function(list) {
		return Promise.all(list.map(function(name) {
			if (path.basename(name).startsWith('ax') == false || path.extname(name) != '.json') return;
			return readFile(path.join(inputDir, name)).then(function(buf) {
				return JSON.parse(buf);
			}).then(function(obj) {
				results = results.concat(obj.results);
			});
		}));
	}).then(function() {
		return writeFile(output, JSON.stringify(results, null, ' '));
	});
};
