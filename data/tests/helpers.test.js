const {ObjectId} = require('mongodb');
const helpers = require('../helpers');

test('Tests bad input on stringHandler', () => {
    expect.assertions(1);
    try {
        helpers.stringHandler(12345, 'Number input');
    } catch (e) {
        expect(e).toBe('Error: Number input must be a string.');
    }
});

test('Tests empty string on stringHandler', () => {
    expect.assertions(1);
    try {
        helpers.stringHandler('', 'Empty string input');
    } catch (e) {
        expect(e).toBe('Error: Empty string input cannot be only whitespace.');
    }
});

test('Tests whitespace on stringHandler', () => {
    expect.assertions(1);
    try {
        helpers.stringHandler('', 'Whitespace input');
    } catch (e) {
        expect(e).toBe('Error: Whitespace input cannot be only whitespace.');
    }
});

test('Tests good input on stringHandler', () => {
    expect(helpers.stringHandler('dog', 'Good Input')).toBe('dog');
})

test('Tests good input (with whitespace) on stringHandler', () => {
    expect(helpers.stringHandler('     dog   ', 'Good Input')).toBe('dog');
})

test('Tests bad ID (not a string) on strToId', () => {
    expect.assertions(1);
    try {
        helpers.strToId(true, 'Boolean');
    } catch (e) {
        expect(e).toBe('Error: Boolean Object ID is not valid.');
    }
})

test('Tests bad ID (string) on strToId', () => {
    expect.assertions(1);
    try {
        helpers.strToId('12345', 'Bad string');
    } catch (e) {
        expect(e).toBe('Error: Bad string Object ID is not valid.');
    }
})

test('Tests good ID on strToId', () => {
    expect(helpers.strToId('6355e9a0441958533a268ef0', 'Valid ID String'))
        .toEqual(ObjectId('6355e9a0441958533a268ef0'));
})

test('Tests idHandler', () => {
    expect(helpers.idHandler('    6355e9a0441958533a268ef0  ', 'Valid ID with whitespace'))
        .toEqual(ObjectId('6355e9a0441958533a268ef0'));
})

test('Tests removeDuplicates non-array', () => {
    expect.assertions(1);
    try {
        helpers.removeDuplicates('12345');
    } catch (e) {
        expect(e).toBe('Error: removeDuplicates received a non-array item.');
    }
})

test('Tests removeDuplicates (no duplicates)', () => {
    expect(helpers.removeDuplicates(['1', '2', '3', '4', '5']))
        .toEqual(['1', '2', '3', '4', '5']);
})

test('Tests removeDuplicates (duplicates)', () => {
    expect(helpers.removeDuplicates(['1', '2', '2', '3', '3', '3', '44', '44', '5']))
        .toEqual(['1', '2', '3', '44', '5']);
})

test('Tests arrayContentEquality non-array 1', () => {
    expect.assertions(1);
    try {
        helpers.arrayContentEquality('12345', [1, 2, 3, 4, 5]);
    } catch (e) {
        expect(e).toBe('Error: First input is a non-array item.');
    }
})

test('Tests arrayContentEquality non-array 2', () => {
    expect.assertions(1);
    try {
        helpers.arrayContentEquality([1, 2, 3, 4, 5], '1, 2, 3, 4, 5');
    } catch (e) {
        expect(e).toBe('Error: Second input is a non-array item.');
    }
})

test('Tests arrayContentEquality unequal array lengths', () => {
    expect(helpers.arrayContentEquality([1, 2, 3, 4, 5], [1, 2, 3]))
        .toBe(false);
})

test('Tests arrayContentEquality false', () => {
    expect(helpers.arrayContentEquality([1, 2, 3, 4, 6], [5, 4, 2, 3, 1]))
        .toBe(false);
})

test('Tests arrayContentEquality true', () => {
    expect(helpers.arrayContentEquality([1, 2, 3, 4, 5], [5, 4, 2, 3, 1]))
        .toBe(true);
})