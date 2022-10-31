const mongoCollections = require('../config/mongoCollections');
const families = mongoCollections.families;
const {ObjectId} = require('mongodb');
const helpers = require('./helpers');

const idsToStrings = (family) => {
    family._id = family._id.toString();
    family.parents = family.parents.map(id => id.toString());
    family.children = family.children.map(id => id.toString());
    family.articleWriteHistory = family.articleWriteHistory.map(entry => {
        entry[0] = entry[0].toString();
        entry[1] = entry[1].toString();
    });
    family.articleViewHistory = family.articleViewHistory.map(entry => {
        entry[0] = entry[0].toString();
        entry[1] = entry[1].toString();
    });
    family.commentHistory = family.commentHistory.map(entry => {
        entry[0] = entry[0].toString();
        entry[1] = entry[1].toString();
    });
    return family;
}

// children, articleWriteHistory, articleViewHistory, commentHistory are initialized empty. 
const createFamily = async (
    parents
) => {
    parents = parents.map(id => helpers.stringHandler(id, 'Parent Object ID'));
    parents = helpers.removeDuplicates(parents);
    parents = parents.map(id => helpers.strToId(id, 'Parent'));

    const newFamily = {
        parents: parents,
        children: [],
        articleWriteHistory: [],
        articleViewHistory: [],
        commentHistory: []
    }

    const familyColl = await families();
    const insertInfo = await familyColl.insertOne(newFamily);

    if (!insertInfo.acknowledged || !insertInfo.insertedId)
        throw 'Error: Could not add family';
    
    const newId = insertInfo.insertedId.toString();
    const family = await getFamilyById(newId);
    return family;
}

const getAllFamilies = async () => {
    const familyColl = await families();
    let familyList = await familyColl.find({}).toArray();
    if (!familyList) throw 'Error: Could not get all families';

    familyList = familyList.map(idsToStrings);

    return familyList;
}

const getFamilyById = async (id) => {
    id = helpers.idHandler(id, 'Family');

    const familyColl = await families();
    let family = await familyColl.findOne({_id: id});
    if (family === null) throw 'Error: No family with that id.';
    family = idsToStrings(family);
    return family;
}

const updateFamily = async (
    id, 
    parents, 
    children
) => {
    const family = await getFamilyById(id);

    parents = parents.map(id => helpers.stringHandler(id, 'Parent Object ID'));
    parents = helpers.removeDuplicates(parents);
    children = children.map(id => helpers.stringHandler(id, 'Child Object ID'));
    children = helpers.removeDuplicates(children);

    if (helpers.arrayContentEquality(family.parents, parents) && 
        helpers.arrayContentEquality(family.children, children)) {
        
        throw 'Error: Family update inputs are same as current'
    }

    id = helpers.idHandler(id);
    parents = parents.map(id => helpers.strToId(id, 'Parent'));
    children = children.map(id => helpers.strToId(id, 'Child'));

    const updatedFamily = {
        parents: parents,
        children: children,
        articleWriteHistory: family.articleWriteHistory,
        articleViewHistory: family.articleViewHistory,
        commentHistory: family.commentHistory
    }

    const familyColl = await families();
    const updatedInfo = await familyColl.updateOne(
        {_id: id},
        {$set: updatedFamily}
    );
    if (updatedInfo.modifiedCount === 0) {
        throw 'Error: Could not update the family successfully';
    }
    
    return await getFamilyById(id.toString());
}

const removeFamily = async (id) => {
    id = helpers.idHandler(id, 'Family');

    const familyColl = await families();
    const deletionInfo = await familyColl.deleteOne({_id: id});
    if (deletionInfo.deletedCount === 0) {
        throw `Could not delete movie with id of ${id.toString()}`;
    }
    return `Family has been successfully deleted!`;
        // Possible future refactor: Add a way to identify the family to this message. 
        // Maybe the first parent's first name? 
}

module.exports = {
    createFamily,
    getAllFamilies,
    getFamilyById,
    updateFamily,
    removeFamily
}