const helpers = require('../helpers');

test('Tests various inputs on the string handler', () => {
    expect.assertions(8);
    try {
        helpers.stringHandler(undefined, 'Undefined');
    } catch (e) {
        expect(e).toMatch('Error: Undefined must be a string.');
    }
    try {
        helpers.stringHandler(null, 'Null');
    } catch (e) {
        expect(e).toMatch('Error: Null must be a string.');
    }
    try {
        helpers.stringHandler(23, 'Number');
    } catch (e) {
        expect(e).toMatch('Error: Number must be a string.');
    }
    try {
        helpers.stringHandler(true, 'Boolean');
    } catch (e) {
        expect(e).toMatch('Error: Boolean must be a string.');
    }
    try {
        helpers.stringHandler('', 'Empty string');
    } catch (e) {
        expect(e).toMatch('Error: Empty string cannot be only whitespace.');
    }
    try {
        helpers.stringHandler('     ', 'Whitespace');
    } catch (e) {
        expect(e).toMatch('Error: Whitespace cannot be only whitespace.');
    }
    expect(helpers.stringHandler('dog', 'Good Input')).toMatch('dog');
    expect(helpers.stringHandler('     dog   ', 'Good Input with Whitespace')).toMatch('dog');
});