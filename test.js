var fs = require('fs');
var newLineStream = require('./index');
var test = require('tape');

test('pipe newLine stream to writable stream', function(t) {
  var source = fs.createReadStream('./package.json');
  var target = fs.createWriteStream('./out.json');
  var newLine = newLineStream();
  source.pipe(newLine).pipe(target);

  target.on('finish', function() {
    console.log('all writes are now complete.');

    var input = fs.readFileSync(__dirname + '/package.json', 'utf8');
    var output = fs.readFileSync(__dirname + '/out.json', 'utf8');
    t.equal(output, input);
    t.end();
  });
});

test('read with encoding base64 and pipe newLine stream to writable stream', function(t) {
  var source = fs.createReadStream('./package.json');
  var target = fs.createWriteStream('./out.json', {encoding: 'utf-8'});
  var newLine = newLineStream();
  source.pipe(newLine).pipe(target);

  target.on('finish', function() {
    console.log('all writes are now complete.');

    var input = fs.readFileSync(__dirname + '/package.json', 'utf8');
    var output = fs.readFileSync(__dirname + '/out.json', 'utf8');
    t.equal(output, input);
    t.end();
  });
});


test('output file with line numbers', readNewLine);

test('output file with line numbers :: for the second time', readNewLine);

function readNewLine(t) {
  t.plan(3);
  var source = fs.createReadStream('./package.json');
  var nr = 0, found = 0;
  var newLine = newLineStream();
  source.pipe(newLine);
  newLine.on('line', function(chunk){
    console.log('LINE', chunk);
  });
  newLine.on('readable', function() {
    var line;
    while (line = newLine.read()) {
      nr++;
      var str = nr + ': ' + line;

      switch (nr) {
        case 1:
          t.equal(str, '1: {\n');
          break;
        case 10:
          t.equal(str, '10:     "type": "git",\n');
          break;
        case 27:
          t.equal(str, '27: }\n');
          break;
      }

    }

  });


}