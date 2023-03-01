"use strict";
var parser = require('../node-csv-parse.js'),
    csv = [
        'id,name, date,description',
        '1,test,2016-01-08,"Hello, World!"',
        '2,test2,2016-01-08,"split into 2\nlines"',
        '3,test3,2016-01-08,"split into 2\r\nWindows-style lines"',
        ''
    ].join('\n'),
    tab = [
        'id\tname\t date\t    description',
        '1\ttest\t2016-01-08\t"Hello\t World!"',
        '2\ttest2\t2016-01-08\t"split into 2\nlines"',
        '3\ttest3\t2016-01-08\t"split into 2\r\nWindows-style lines"',
        ''
    ].join('\n');

console.log('CSV:');
console.log(csv);
console.log('');

console.log('CSV As Rows:');
console.log(parser(csv).asRows());
console.log('');

console.log('CSV As Objects:');
console.log(parser(csv).asObjects());
console.log('');

console.log('TAB:');
console.log(tab);
console.log('');

console.log('TAB As Rows:');
console.log(parser(tab, '\t').asRows());
console.log('');

console.log('TAB As Objects:');
console.log(parser(tab, '\t').asObjects());
console.log('');
