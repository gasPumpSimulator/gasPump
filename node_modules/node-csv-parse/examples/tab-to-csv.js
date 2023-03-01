var parser = require('../node-csv-parse.js'),
    tab = [
        'id\tname\t date\t    description',
        '1\ttest\t2016-01-08\t"Hello\t World!"',
        '2\ttest2\t2016-01-08\t"split into 2\nlines"',
        '3\ttest3\t2016-01-08\t"split into 2\r\nWindows-style lines"',
        ''
    ].join('\n');

parser(tab, '\t').asRows().map(row => {
    row.map(c => {
        return `"${c}"`;
    }).join(',');
}).join('\n');
