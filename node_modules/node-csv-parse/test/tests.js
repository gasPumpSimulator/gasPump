"use strict";
var parser = require('../node-csv-parse.js'),
    assert = require('assert'),
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

describe('node-csv-parse', () => {

    // ========================
    // CSV
    // ========================

    describe('(str, ",").asRows', () => {
        it('should work with CSV and return expected data', done => {
            var parsed = parser(csv).asRows();
            assert.ok(parsed[0][0] == 'id');                    // test field
            assert.ok(parsed[0][3] == 'description');           // test trimming
            assert.ok(parsed[1][0] == '1');                     // test line splitting
            assert.ok(parsed[1][3] == 'Hello, World!');         // test quotes
            assert.ok(parsed[2][3] == 'split into 2\nlines');   // test line-break in quotes
            assert.ok(parsed[3][3] == 'split into 2\r\nWindows-style lines'); // test Windows line-break in quotes
            assert.ok(!parsed[4]); // test ignore empty line
            done();
        });
    });

    describe('(str, ",").asObjects', () => {
        it('should work with CSV and return expected data', done => {
            var parsed = parser(csv).asObjects();
            assert.ok(parsed[0].id);                                     // test field
            assert.ok(parsed[0].description);                            // test trimming
            assert.ok(parsed[0].id == '1');                              // test line splitting
            assert.ok(parsed[0].description == 'Hello, World!');         // test quotes
            assert.ok(parsed[1].description == 'split into 2\nlines');   // test line-break in quotes
            assert.ok(parsed[2].description == 'split into 2\r\nWindows-style lines'); // test Windows line-break in quotes
            assert.ok(!parsed[3]); // test ignore empty line
            done();
        });
    });

    // ========================
    // TAB
    // ========================

    describe('(str, "\\t").asRows', () => {
        it('should work with TAB and return expected data', done => {
            var parsed = parser(tab, '\t').asRows();
            assert.ok(parsed[0][0] == 'id');                    // test field
            assert.ok(parsed[0][3] == 'description');           // test trimming
            assert.ok(parsed[1][0] == '1');                     // test line splitting
            assert.ok(parsed[1][3] == 'Hello\t World!');         // test quotes
            assert.ok(parsed[2][3] == 'split into 2\nlines');   // test line-break in quotes
            assert.ok(parsed[3][3] == 'split into 2\r\nWindows-style lines'); // test Windows line-break in quotes
            assert.ok(!parsed[4]); // test ignore empty line
            done();
        });
    });

    describe('(str, "\\t").asObjects', () => {
        it('should work with TAB and return expected data', done => {
            var parsed = parser(tab, '\t').asObjects();
            assert.ok(parsed[0].id);                                     // test field
            assert.ok(parsed[0].description);                            // test trimming
            assert.ok(parsed[0].id == '1');                              // test line splitting
            assert.ok(parsed[0].description == 'Hello\t World!');        // test quotes
            assert.ok(parsed[1].description == 'split into 2\nlines');   // test line-break in quotes
            assert.ok(parsed[2].description == 'split into 2\r\nWindows-style lines'); // test Windows line-break in quotes
            assert.ok(!parsed[3]); // test ignore empty line
            done();
        });
    });
});
