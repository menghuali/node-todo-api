// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017', (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server', err);
  }
  console.log('Connected to MongoDB server');
  const db = client.db('TodoApp');

  db.collection('Todos').findOneAndUpdate(
    {_id: new ObjectID("5c2e86fc18e7dffb684aeee0")},
    {$set: {
      completed: true
    }},
    {returnOriginal: false},
  ).then((result) => {
    console.log(result);
  });

  client.close();
});
