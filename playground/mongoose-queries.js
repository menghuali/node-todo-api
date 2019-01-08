const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {ObjectID} = require('mongodb');

var id = '5c33a7c9f1c1713d7cdce42611';
if (!ObjectID.isValid(id)) {
  return console.log('ID is not valid');
}

Todo.find({
  _id: id
}).then((todos) => {
  console.log('Todos', todos);
});

Todo.findOne({
  _id: id
}).then((todo) => {
  console.log('Todo', todo);
});

Todo.findById(id).then((todo) => {
  console.log('Todo', todo);
}).catch((e) => console.log(e));
