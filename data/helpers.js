// This file is for all of our helper/validation functions. 

const {ObjectId} = require('mongodb');

const stringHandler = (string, name) => {
    if (typeof string !== 'string'){
        throw `Error: ${name} must be a string.`;
    }
    const trimmed = string.trim();
    if (trimmed.length === 0){
        throw `Error: ${name} cannot be only whitespace.`;
    }
    return trimmed;
};

const strToId = (idString, name) => {
    if (!ObjectId.isValid(idString)) throw `Error: ${name} Object ID is not valid`;
    return ObjectId(idString);
}

// This function is just a composition of stringHandler and strToId
// This pattern appears often throughout the program. 
const idHandler = (idString, name) => {
    idString = stringHandler(idString, `${name} Object ID`);
    const id = strToId(idString, name);
    return id;
}

// Works with primitives, not sure for objects! Be careful!
const removeDuplicates = (array) => {
    const newArray = [];
    for (let item of array){
        if (!newArray.includes(item)) newArray.push(item);
    }
    return newArray;
}

// Works on one-dimension arrays with primitives and no duplicates
const arrayContentEquality = (array1, array2) => {
    if (array1.length != array2.length){
        return false;
    }
    for (let item of array1){
        if (!array2.includes(item)) return false;
    }
    return true;
}

module.exports = {
    stringHandler,
    strToId,
    idHandler,
    removeDuplicates, 
    arrayContentEquality
}