const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');
const {ObjectID} = require('mongodb');

// Todo.remove({}).then((result) => {
//   console.log(result);
// });

// Todo.findOneAndRemove({}).then((result) => {
// });

Todo.findByIdAndRemove('5c37e41df7af9bcdb30ad59d').then((todo) => {
  console.log(todo);
});
