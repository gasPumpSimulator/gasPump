"use strict";
var parser = require('../node-csv-parse.js'),
    assert = require('assert'),
    csv = [
        'text,"""quoted"" header""",blah""blah',
        '1,2,"3"',
        '2,""3"",4',
        ''
    ].join('\n');

describe('node-csv-parse - GitHub Issue #1: Quotes in cells cause parser to fail', () => {
    describe('(str).asRows', () => {
        it('should be able to parse quotes in cells', done => {
            var parsed = parser(csv).asRows();
            console.log(parsed);
            assert.ok(parsed[0][0] == 'text');             // simple test
            assert.ok(parsed[0][1] == '"quoted" header"'); // quoted w/ quotes at ends and inside
            assert.ok(parsed[0][2] == 'blah"blah');        // quote inside unquoted string
            assert.ok(parsed[1][2] == '3');                // quoted value
            assert.ok(parsed[2][1] == '"3"');              // escaped, quoted value
            done();
        });
    });

    describe('(str).asObjects', () => {
        it('should be able to parse quotes in cells', done => {
            var parsed = parser(csv).asObjects();
            assert.ok(parsed[0]['text'] == '1');               // simple test
            assert.ok(parsed[0]['"quoted" header"'] == '2');   // quoted header w/ quotes at ends and inside
            assert.ok(parsed[0]['blah"blah'] == '3');          // quote inside unquoted header
            assert.ok(parsed[1]['"quoted" header"'] == '"3"'); // quoted value
            done();
        });
    });
});
