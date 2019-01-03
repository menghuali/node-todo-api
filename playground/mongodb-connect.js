// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server', err);
  }
  console.log('Connected to MongoDB server');

  try {
    const db = client.db('TodoApp')
    // db.collection('Todos').insertOne({
    //   text: 'Something to do',
    //   completed: false
    // }, (err, result) => {
    //   if(err) {
    //     return console.log('Unable to insert todo', err);
    //   }
    //   console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    // db.collection('Users').insertOne({
    //   name: 'Menghua',
    //   age: 38,
    //   location: 'Ontario'
    // }, (err, result) => {
    //   if (err) {
    //     return console.log('Unable to insert user', err);
    //   }
    //   console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
    // });
  } catch (e) {
    console.log('Encountered error', e);
  } finally {
    client.close();
  }
});
