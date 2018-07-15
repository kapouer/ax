var got = require('got');
var write = require('util').promisify(require('fs').writeFile);

var url = "https://ax.polytechnique.org/fullsearch.php";
var query = {
	q: '*',
	entities_list: 'User'
};
if (process.argv.length != 3) {
	console.error("Usage: node index.js <cookie>");
	process.exit(1);
}
var cookie = process.argv.pop();

var output = "data/results.json";

scrape(0, 1000).then(function(size) {
	console.info("Done scraping", size, "entries");
	return require('./aggregate')('data/', output).then(function() {
		console.info("wrote single", output);
	});
});

function scrape(from, size) {
	return got(url, {
		query: Object.assign({}, query, {
			from: from,
			size: size
		}),
		headers: {
			Cookie: cookie,
			Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
		},
		json: true
	}).then(function(res) {
		var obj = res.body;
		if (!obj || !obj.size) return;
		var rsize = parseInt(obj.size);
		from += rsize;
		// FIXME this check won't stop the loop
		if (rsize < size) return from;
		return write(`data/ax${from}.json`, JSON.stringify(obj, null, " ")).then(function() {
			return scrape(from, size);
		});
	});
}

