var test = require('tape');
var fs = require('fs');
var path = require('path');
var newLineStream = require('../index');
var inputPath = path.resolve(__dirname + '/../package.json');
var outputPath = path.resolve(__dirname + '/out.json');

test('pipe newLine stream to writable stream', function(t) {
  var source = fs.createReadStream(inputPath);
  var target = fs.createWriteStream(outputPath);
  var newLine = newLineStream();
  source.pipe(newLine).pipe(target);

  target.on('finish', function() {
    var input = fs.readFileSync(inputPath, 'utf8');
    var output = fs.readFileSync(outputPath, 'utf8');
    t.equal(output, input);
    t.end();
  });
});

test('read with encoding base64 and pipe newLine stream to writable stream', function(t) {
  var source = fs.createReadStream(inputPath);
  var target = fs.createWriteStream(outputPath, {encoding: 'utf-8'});
  var newLine = newLineStream();
  source.pipe(newLine).pipe(target);

  target.on('finish', function() {
    var input = fs.readFileSync(inputPath, 'utf8');
    var output = fs.readFileSync(outputPath, 'utf8');
    t.equal(output, input);
    t.end();
  });
});


test('output file with line numbers', readNewLine);

test('output file with line numbers :: for the second time', readNewLine);

function readNewLine(t) {
  t.plan(6);
  var source = fs.createReadStream(inputPath);
  var nr = 0, found = 0;
  var newLine = newLineStream();
  source.pipe(newLine);

  newLine.on('readable', function() {
    var line;
    while (line = newLine.read()) {
      nr++;
      transform(nr, line);
    }
  });

  newLine.on('line', function(line){
    transform(nr, line);
  });

  function transform(nr, line) {
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

}