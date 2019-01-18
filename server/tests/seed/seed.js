const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/todo.js');
const {User} = require('./../../models/user.js');
const jwt = require('jsonwebtoken');

const todos = [
  {
    _id: new ObjectID(),
    text: '1st text todo'
  },
  {
    _id: new ObjectID(),
    text: '2nd text todo'
  }
];

const populateTodos = (done) => {
  Todo.deleteMany({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
};

var userOneId = new ObjectID();
var userTwoId = new ObjectID();

const users = [{
  _id: userOneId,
  email: 'mli@gmail.com',
  password: 'userOnePass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, 'salt').toString()
  }]
}, {
  _id: userTwoId,
  email: 'henry@gmail.com',
  password: 'userTwoPass'
}];

const populateUsers = (done) => {
  User.deleteMany({}).then(() => {
    // Cannot use insertMany because it bypass the middleware that encrypt the password. Instead, call save.
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();
    // What until all promises are done.
    return Promise.all([userOne, userTwo]);
  }).then(() => done());
};

module.exports = { todos, populateTodos, users, populateUsers };
