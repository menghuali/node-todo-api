// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017', (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server', err);
  }
  console.log('Connected to MongoDB server');
  const db = client.db('TodoApp');

  db.collection('Users').findOneAndUpdate(
    { _id: new ObjectID("5c2f414c3b2df55ba3ea68dd") },
    {
      $set: { name: 'Menghua' },
      $inc: { age: 1 }
    },
    { returnOriginal: false}
  ).then((result) => {
    console.log(result);
  });

  client.close();
});
