const mongoCollections = require('../config/mongoCollections');
const families = mongoCollections.families;
const {ObjectId} = require('mongodb');
const users = require('./users')
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

const updateUserFamilies = async (userIds, value) => {
    for (let userId of userIds){
        const user = await users.get(userId);
        user.family = value;
        //TODO: Implement in users.
        await users.updateUser(
            userId,
            user.type,
            user.email,
            user.name,
            user.username,
            user.family,
//            user.content_restrict
        );
    }
}

// children, articleWriteHistory, articleViewHistory, commentHistory are initialized empty. 
const createFamily = async (
    parents
) => {
    if (!Array.isArray(parents) || parents.length === 0) {
        throw 'Error: Array of one or more parent Object IDs must be provided.';
    }

    parents = parents.map(id => helpers.stringHandler(id, 'Parent Object ID'));
    parents = helpers.removeDuplicates(parents);
    parents = parents.map(id => helpers.strToId(id, 'Parent'));

    // Verify that each parent user exists.
    for (let parent of parents) {
        await users.get(parent.toString());
    }

    const newFamily = {
        parents: parents,
        children: [],
        articleWriteHistory: [],
        articleViewHistory: [],
        commentHistory: [],
        content_restrict:5
    }

    const familyColl = await families();
    const insertInfo = await familyColl.insertOne(newFamily);

    if (!insertInfo.acknowledged || !insertInfo.insertedId)
        throw 'Error: Could not add family';
    
    const newId = insertInfo.insertedId.toString();
    const family = await getFamilyById(newId);

    await updateUserFamilies(family.parents, newId);

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

    if (!Array.isArray(parents) || parents.length === 0) {
        throw 'Error: Array of one or more parent Object IDs must be provided.';
    }
    if (!Array.isArray(children)) {
        throw 'Error: Array of zero or more children Object IDs must be provided.';
    }

    parents = parents.map(id => helpers.stringHandler(id, 'Parent Object ID'));
    parents = helpers.removeDuplicates(parents);
    children = children.map(id => helpers.stringHandler(id, 'Child Object ID'));
    children = helpers.removeDuplicates(children);

    if (helpers.arrayContentEquality(family.parents, parents) && 
        helpers.arrayContentEquality(family.children, children)) {
        throw 'Error: Family update inputs are same as current.'
    }

    id = helpers.idHandler(id, 'Family');
    parents = parents.map(id => helpers.strToId(id, 'Parent'));
    children = children.map(id => helpers.strToId(id, 'Child'));

    // Check that all input parents and children exist.
    for (let parent of parents) {
        await users.get(parent.toString());
    }
    for (let child of children) {
        await users.get(child.toString());
    }

    // Wipe family for all users currently in the family object.
    await updateUserFamilies(family.parents, null);
    await updateUserFamilies(family.children, null);

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
    
    const newFamily =  await getFamilyById(id.toString());

    // Update all current parents and children to have the family id.
    await updateUserFamilies(newFamily.parents, newFamily._id);
    await updateUserFamilies(newFamily.children, newFamily._id);

    return newFamily;
}

const removeFamily = async (id) => {
    id = helpers.idHandler(id, 'Family');

    const familyColl = await families();

    // Set applicable users' families to null (and check that family exists).
    const familyToDelete = await getFamilyById(id.toString());
    updateUserFamilies(familyToDelete.parents, null);
    updateUserFamilies(familyToDelete.children, null);

    const deletionInfo = await familyColl.deleteOne({_id: id});
    if (deletionInfo.deletedCount === 0) {
        throw `Could not delete movie with id of ${id.toString()}`;
    }
    return `Family has been successfully deleted!`;
        // Possible future refactor: Add a way to identify the family to this message. 
        // Maybe the first parent's first name? 
}

const updateContentRestrict = async (id, level) => {
    const familyColl = await families();
    const updateInfo = await familyColl.updateOne(
    { _id: ObjectId(id) },
    { $set: { content_restrict: parseInt(level) } }
    );
    return `Family has been successfully deleted!`;
}

module.exports = {
    createFamily,
    getAllFamilies,
    getFamilyById,
    updateFamily,
    removeFamily,
    updateContentRestrict
}