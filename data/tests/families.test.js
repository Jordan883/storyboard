const {ObjectId} = require('mongodb');
const families = require('../families');
const users = require('../users');
const connection = require("../../config/mongoConnection");

jest.mock('../../config/mongoConnection');
jest.mock('../users');

beforeAll(async () => {
    const db = await connection.dbConnection();
    await db.dropDatabase();
})

afterAll(async () => {
    const db = await connection.dbConnection();
    await db.dropDatabase();
    await connection.closeConnection();
})

describe('Create family tests', () => {
    afterAll(async () => {
        const db = await connection.dbConnection();
        await db.dropDatabase();
    })

    test('Tests no input on create family', async () => {
        expect.assertions(1);
        try {
            await families.createFamily();
        } catch (e) {
            expect(e).toBe('Error: Array of one or more parent Object IDs must be provided.');
        }
    })
    
    test('Tests empty array input on create family', async () => {
        expect.assertions(1);
        try {
            await families.createFamily([]);
        } catch (e) {
            expect(e).toBe('Error: Array of one or more parent Object IDs must be provided.');
        }
    })
    
    test('Tests stringHandler call on create family', async () => {
        expect.assertions(1);
        try {
            await families.createFamily([1, 2, 3, 4, 5]);
        } catch (e) {
            expect(e).toBe('Error: Parent Object ID must be a string.');
        }
    })
    
    test('Tests strToId call on create family', async () => {
        expect.assertions(1);
        try {
            await families.createFamily(['bad_id']);
        } catch (e) {
            expect(e).toBe('Error: Parent Object ID is not valid.');
        }
    })

    test('Tests parent ID not found on create family', async () => {
        expect.assertions(1);
        try {
            const noParentFound = 'Error: No user with that ID.';
            users.get.mockRejectedValue(noParentFound);
            await families.createFamily([ObjectId(32).toString()]);
        } catch (e) {
            expect(e).toBe('Error: No user with that ID.');
        }
    })

    test('Tests creating valid family', async () => {
        const validParent1_id = ObjectId(32).toString();
        const validParent2_id = ObjectId(32).toString();
        const validParent1 = {
            _id: validParent1_id,
            family: null
        };
        const validParent2 = {
            _id: validParent2_id,
            family: null
        };
        users.get.mockResolvedValueOnce(validParent1).mockResolvedValueOnce(validParent2)
            .mockResolvedValueOnce(validParent1).mockResolvedValueOnce(validParent2);
        users.updateUser.mockImplementationOnce(() => validParent1.family = 'hit!')
            .mockImplementationOnce(() => validParent2.family = 'hit!');
        const family = await families.createFamily([validParent1_id, validParent2_id, validParent1_id]);
        expect(family.parents).toEqual([validParent1_id, validParent2_id]);
        expect(validParent1.family).toBe('hit!');
        expect(validParent2.family).toBe('hit!');
    })
})

describe('Read/Update/Delete Family Tests', () => {
    let family1 = null;
    let family2 = null;

    beforeAll(async () => {
        const validParent1_id = ObjectId(32).toString();
        const validParent2_id = ObjectId(32).toString();
        const validParent1 = {
            _id: validParent1_id,
            family: null
        };
        const validParent2 = {
            _id: validParent2_id,
            family: null
        };
        users.get.mockResolvedValue(validParent1);
        users.updateUser.mockImplementationOnce(() => validParent1.family = 'hit!');
        family1 = await families.createFamily([validParent1_id]);
        users.get.mockResolvedValue(validParent2);
        users.updateUser.mockImplementationOnce(() => validParent2.family = 'hit!');
        family2 = await families.createFamily([validParent2_id]);
    })

    afterAll(async () => {
        const db = await connection.dbConnection();
        await db.dropDatabase();
    })

    test('Tests get all families', async () => {
        const familyArr = await families.getAllFamilies();
        expect(familyArr).toEqual([family1, family2]);
    })

    test('Tests idHandler call on get family by Id', async () => {
        expect.assertions(1);
        try {
            await families.getFamilyById('bad_id');
        } catch (e) {
            expect(e).toBe('Error: Family Object ID is not valid.');
        }
    })

    test('Tests get family by Id no family found', async () => {
        expect.assertions(1);
        try {
            await families.getFamilyById(ObjectId(32).toString());
        } catch (e) {
            expect(e).toBe('Error: No family with that id.');
        }
    })

    test('Tests valid get family by Id', async () => {
        const foundFamily = await families.getFamilyById(family1._id);
        expect(foundFamily).toEqual(family1);
    })

    test('Tests no parent input on update family', async () => {
        expect.assertions(1);
        try {
            await families.updateFamily(family1._id);
        } catch (e) {
            expect(e).toBe('Error: Array of one or more parent Object IDs must be provided.');
        }
    })

    test('Tests parent empty array input on update family', async () => {
        expect.assertions(1);
        try {
            await families.updateFamily(family1._id, []);
        } catch (e) {
            expect(e).toBe('Error: Array of one or more parent Object IDs must be provided.');
        }
    })
    
    test('Tests no child input on update family', async () => {
        expect.assertions(1);
        try {
            await families.updateFamily(family1._id, [family1.parents[0]]);
        } catch (e) {
            expect(e).toBe('Error: Array of zero or more children Object IDs must be provided.');
        }
    })

    test('Tests invalid child input on update family', async () => {
        expect.assertions(1);
        try {
            await families.updateFamily(family1._id, [family1.parents[0]], 123);
        } catch (e) {
            expect(e).toBe('Error: Array of zero or more children Object IDs must be provided.');
        }
    })
    
    test('Tests parent stringHelper call on update family', async () => {
        expect.assertions(1);
        try {
            await families.updateFamily(family1._id, [1, 2, 3, 4, 5], []);
        } catch (e) {
            expect(e).toBe('Error: Parent Object ID must be a string.');
        }
    })

    test('Tests child stringHelper call on update family', async () => {
        expect.assertions(1);
        try {
            await families.updateFamily(family1._id, [family1.parents[0]], [1, 2, 3, 4, 5]);
        } catch (e) {
            expect(e).toBe('Error: Child Object ID must be a string.');
        }
    })

    test('Tests unchanged params on update family', async () => {
        expect.assertions(1);
        try {
            await families.updateFamily(family1._id, [family1.parents[0]], []);
        } catch (e) {
            expect(e).toBe('Error: Family update inputs are same as current.');
        }
    })

    // Note: This should actually be thrown by the getFamilyById() call at the start 
    // of the update method. 
    test('Tests idHandler call on update family', async () => {
        expect.assertions(1);
        try {
            await families.updateFamily('bad_id', [family1.parents[0]], []);
        } catch (e) {
            expect(e).toBe('Error: Family Object ID is not valid.');
        }
    })
    
    test('Tests parent strToId call on create family', async () => {
        expect.assertions(1);
        try {
            await families.updateFamily(family1._id, ['bad_id'], []);
        } catch (e) {
            expect(e).toBe('Error: Parent Object ID is not valid.');
        }
    })

    test('Tests child strToId call on create family', async () => {
        expect.assertions(1);
        try {
            await families.updateFamily(family1._id, [family1.parents[0]], ['bad_id']);
        } catch (e) {
            expect(e).toBe('Error: Child Object ID is not valid.');
        }
    })

    test('Tests parent ID not found on update family', async () => {
        expect.assertions(1);
        try {
            const noParentFound = 'Error: No user with that ID.';
            users.get.mockRejectedValue(noParentFound);
            await families.updateFamily(family1._id, [ObjectId(32).toString()], []);
        } catch (e) {
            expect(e).toBe('Error: No user with that ID.');
        }
    })

    test('Tests child ID not found on update family', async () => {
        expect.assertions(1);
        try {
            const theParent = {
                _id: family1.parents[0],
                family: family1._id
            };
            const noChildFound = 'Error: No user with that ID.';
            users.get.mockResolvedValueOnce(theParent).mockRejectedValue(noChildFound);
            await families.updateFamily(family1._id, [family1.parents[0]], [ObjectId(32).toString()]);
        } catch (e) {
            expect(e).toBe('Error: No user with that ID.');
        }
    })

    test('Tests valid family update', async () => {
        const oldParent = {
            _id: family1.parents[0],
            family: family1._id
        };
        const newParent = {
            _id: ObjectId(32).toString(),
            family: 'old_fam'
        };
        const newChild = {
            _id: ObjectId(32).toString(),
            family: 'old_fam'
        };
        users.get.mockResolvedValueOnce(newParent).mockResolvedValueOnce(newChild)
            .mockResolvedValueOnce(oldParent)
            .mockResolvedValueOnce(newParent).mockResolvedValueOnce(newChild);
        users.updateUser
            .mockImplementationOnce(() => {
                oldParent.family = null;
            })
            .mockImplementationOnce(() => {
                newParent.family = family1._id;
            })
            .mockImplementationOnce(() => {
                newChild.family = family1._id;
            })
        const updatedFamily = await families.updateFamily(
            family1._id, [newParent._id, newParent._id], [newChild._id, newChild._id]);
        expect(updatedFamily.parents).toEqual([newParent._id]);
        expect(updatedFamily.children).toEqual([newChild._id]);
        expect(oldParent.family).toBe(null);
        expect(newParent.family).toBe(family1._id);
        expect(newChild.family).toBe(family1._id);
        expect(users.updateUser.mock.calls.length).toBe(3);
    })

    test('Tests idHandler call on remove family', async () => {
        expect.assertions(1);
        try {
            await families.removeFamily('bad_id');
        } catch (e) {
            expect(e).toBe('Error: Family Object ID is not valid.');
        }
    })

    test('Tests valid delete family', async () => {
        const parent = {
            _id: family2.parents[0],
            family: family2._id
        };
        users.get.mockResolvedValue(parent);
        users.updateUser
            .mockImplementationOnce(() => {
                parent.family = null;
            })
        const deleted = await families.removeFamily(family2._id);
        expect(parent.family).toBe(null);
        expect(deleted).toBe('Family has been successfully deleted!');
    })
})