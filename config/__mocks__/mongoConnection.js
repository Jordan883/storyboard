const connection = jest.createMockFromModule('../mongoConnection');

const MongoClient = require('mongodb').MongoClient;

let _connection = undefined;
let _db = undefined;

connection.dbConnection = async () => {
    if (!_connection) {
        _connection = await MongoClient.connect(global.__MONGO_URI__, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        _db = await _connection.db();
    }
    return _db;
}

connection.closeConnection = async () => {
    await _connection.close();
}

module.exports = connection;