const {MongoClient, ObjectID} = require('mongodb');
const client = new MongoClient('mongodb://localhost:27017');

client.connect((err) => {
    if (err) {
      return console.log('Unable to connect to MongoDB', err);
    }

    try {
      const db = client.db('TodoApp');
      // deleteMany
      db.collection('Users').deleteMany({name: 'Menghua'}).then((result) => {
        console.log('deleteMany', result.result);
      });

      // deleteOne
      db.collection('Users').deleteOne({name: 'Henry'}).then((result) => {
        console.log('deleteOne', result.result);
      });

      // findOneAndDelete
      db.collection('Users').findOneAndDelete({
        _id: new ObjectID("5c2f41473b2df55ba3ea68d9")}).then((result) => {
        console.log('findOneAndDelete', result);
      });
    } finally {
      client.close();
    }
  }
);
