var fs = require('fs');
var newLineStream = require('./index');
var source = fs.createReadStream('./package.json');
var target = fs.createWriteStream('./out.json');
var newLine = newLineStream();
source.pipe(newLine).pipe(target);

var nr = 0;
newLine.on('line', function(line) {
  console.log(++nr + ': ' + line);
});