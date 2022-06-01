require('dotenv').config();

const users = require('./users');
const contacts = require('./contacts');

const MongoClient = require('mongodb').MongoClient;
const bcrypt = require('bcrypt');

function seedCollection(collectionName, initialRecords) {
  console.log('Seeed', process.env.DB_CONN, collectionName);
  MongoClient.connect(process.env.DB_CONN, (err, client) => {
    // console.log('Error', err);
    console.log('connected to mongodb...');
    if (err) throw err;

    var db = client.db("mongo01062022");
    const collection = db.collection(collectionName);

    collection.deleteMany({});

    initialRecords.forEach((item) => {
      if (item.password) {
        item.password = bcrypt.hashSync(item.password, 10);
      }
    });

    collection.insertMany(initialRecords, (err, result) => {
      console.log(`${result.insertedCount} records inserted.`);
      console.log('closing connection...');
      client.close();
      console.log('done.');
    });
  });
}

seedCollection('users', users);
seedCollection('contacts', contacts);
