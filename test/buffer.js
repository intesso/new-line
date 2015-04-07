var assert = require('assert');
var buf, buf2;

buf = new Buffer([0x00, 0x41, 0x7f]);
buf2 = new Buffer(buf.toString());

//console.log(buf, buf2);
// -> <Buffer 00 41 7f> <Buffer 00 41 7f>
assert(buf2.equals(buf), 'buffer with normal acii chars can be converted to string and back');

buf = new Buffer([0x00, 0x41, 0x80]);
buf2 = new Buffer(buf.toString());

//console.log(buf, buf2);
// -> <Buffer 00 41 80> <Buffer 00 41 ef bf bd>
assert(!buf2.equals(buf), 'buffer with chars >= 0x80 (128) cant be converted to string and back');