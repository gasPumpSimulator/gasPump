// node-csv-parse.js
// Created by Caleb Everett <everettcaleb95@gmail.com>
// Licensed under GPL-2.0
"use strict";
(()=>{
    // ========================
    // Library
    // ========================

    // Returns an array of tokens (each token is either a string value or newline character)
    // str: The string to tokenize
    // separator: The separator character, use ',' for CSV and '\t' for Tab-delimited
    function tokenize(str, separator) {
        var c = null,
            i = 0,
            sl = str.length,
            t = '',
            tokens = [],
            inQuotes = false;

        while(true) {
            c = str[i];

            // check if this is the last character
            if(i + 1 === sl) {
                // handle special quote logic
                if(inQuotes) {
                    switch(c) {
                        case '"':
                            inQuotes = false;
                            break;
                        default:
                            t += c;
                    }
                    tokens.push(t);
                }
                else {
                    switch(c) {
                        case separator:
                            if(t.length) {
                                tokens.push(t);
                            }
                            break;
                        case '"':
                            break;
                        case '\n':
                            if(t.length) {
                                tokens.push(t);
                            }
                            tokens.push('\n');
                            break;
                        default:
                            t += c;
                            tokens.push(t);
                    }
                }
                return tokens;
            }
            // we've passed the last character already
            else if(i >= sl) {
                if(t.length) {
                    tokens.push(t);
                }
                return tokens;
            }
            // not the last character so business as usual
            else {
                // handle special quote logic
                if(inQuotes) {
                    switch(c) {
                        case '"':
                            // handle escaped quotes
                            if(str[i+1] === '"') {
                                i++;
                                t += '"';
                            }
                            else {
                                inQuotes = false;
                                tokens.push(t);
                                t = '';
                            }
                            break;
                        default:
                            t += c;
                    }
                }
                else {
                    switch(c) {
                        case separator:
                            if(t.length) {
                                tokens.push(t);
                                t = '';
                            }
                            break;
                        case '"':
                            // handle escaped quotes
                            if(str[i+1] === '"') {
                                i++;
                                t += '"';
                            }
                            else {
                                inQuotes = true;
                            }
                            break;
                        case '\n':
                            if(t.length) {
                                tokens.push(t);
                                t = '';
                            }
                            tokens.push('\n');
                            break;
                        default:
                            t += c;
                    }
                }
            }

            i++;
        }
    }

    // Returns an array of rows (which are arrays of values)
    // tokens: An array of tokens to parse
    function buildRows(tokens) {
        var a = [],
            doneWithRow = false,
            i = 0,
            rows = [],
            t = null,
            tl = tokens.length;

        for(; i < tl; i++) {
            t = tokens[i];

            if(t === '\n') {
                doneWithRow = true;
            }
            else {
                a.push(t.trim());
            }

            if(doneWithRow) {
                rows.push(a);
                a = [];
                doneWithRow = false;
            }
        }

        if(a.length) {
            rows.push(a);
        }
        return rows;
    }

    // Returns an array of rows parsed from a CSV/TAB string
    // str: The CSV/TAB string
    // separator: The separator character, use ',' for CSV and '\t' for Tab-delimited
    function getRows(str, separator) {
        return buildRows(tokenize(str, separator));
    }

    // Returns an array of rows (in object form) exluding the header row
    // str: The CSV/TAB string
    // separator: The separator character, use ',' for CSV and '\t' for Tab-delimited
    function getRowsAsObjects(str, separator) {
        var i = 0,
            rows = getRows(str, separator),
            rl = rows.length,
            r = {};

        var header = rows[i++],
            objs = [];

        // there have to be at least 2 rows for this to do anything: header and data
        if(rl < 2) {
            return [];
        }

        for(; i < rl; i++) {
            r = {};
            rows[i].forEach((c, i) => {
                r[header[i]] = c;
            });
            objs.push(r);
        }

        return objs;
    }

    // ========================
    // Exports
    // ========================

    // Simple utility function for parsing that returns bound short-hand functions
    // str: The CSV/TAB string
    // separator: The separator character, use ',' for CSV and '\t' for TAB, optional: defaults to ','
    // EXAMPLE:
    //   var csv = require('node-csv-parse')(data).asRows();
    // - or -
    //   var tabfile = require('node-csv-parse')(data, '\t').asObjects();
    // END EXAMPLE
    module.exports = function(str, separator) {
        separator = separator || ',';
        return {
            asRows: getRows.bind(null, str, separator),
            asObjects: getRowsAsObjects.bind(null, str, separator)
        };
    };

    module.exports.parseAsRows = getRows;
    module.exports.parseAsObjects = getRowsAsObjects;
    // Note: generator functions removed unfortunately :/
})();
