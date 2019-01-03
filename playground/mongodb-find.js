// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server', err);
  }
  console.log('Connected to MongoDB server');

  try {
    const db = client.db('TodoApp')
    // db.collection('Todos').find({
    //   _id: new ObjectID('5c2e767722660c20d1265057')})
    //   .toArray().then((docs) => {
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //   console.log('Unable to fech todos', err);
    // });

    // db.collection('Todos').find()
    //   .count().then((count) => {
    //     console.log('Todos count: ', count);
    // }, (err) => {
    //   console.log('Unable to fech todos', err);
    // });

    db.collection('Users').find({name: 'Menghua'})
      .toArray().then((docs) => {
        console.log('Users');
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
      console.log('Unable to fech users', err);
    });
  } catch (e) {
    console.log('Encountered error', e);
  } finally {
    // client.close();
  }
});
