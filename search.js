var results = require('./data/results');

var users = [];
if (process.argv.length != 3) {
	console.error("Usage: node search.js <binet>");
	process.exit(1);
}
var term = process.argv.pop();
var re = new RegExp(term, 'i');

results.forEach(function(item) {
	var found = item.eav.some(function(eav) {
		return eav.ex_binets && eav.ex_binets.some(function(it) {
			return typeof it == "string" ? re.test(it) : it.some(function(str) {
				return re.test(str);
			});
		});
	});
	if (found) users.push(item);
});

var summary = users.sort(function(a, b) {
	if (a.graduation < b.graduation) return -1;
	if (a.graduation > b.graduation) return 1;
	return 0;
}).map(function(u) {
	return `${u['academic.fullpromo']} - ${u.firstname} ${u.lastname} - ${u.eav[0].ex_binets}`;
});

console.log(summary.join('\n'), "\n", summary.length, "results");
