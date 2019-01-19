require('./config/config');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');
const {authenticate} = require('./middleware/authenticate');
const bcrypt = require('bcryptjs');

const port = process.env.PORT;

var app = express();
app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });
  todo.save().then((doc)=> {
    res.send(doc);
  }, (err) => {
    res.status(400).send(err);
  });
});

app.get('/todos', authenticate, (req, res) => {
  Todo.find({_creator: req.user._id}).then((todos) => {
    res.send({todos});
  }, (err) => {
    res.status(500).send(err);
  });
});

app.get('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findOne({
    _id: new ObjectID(id),
    _creator: req.user._id})
    .then((todo) => {
      if (todo === null) {
        res.status('404').send();
      } else {
        res.send({ todo });
      }
    }).catch((e) => res.status('400').send());
});

app.delete('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  Todo.findOneAndDelete({
    _id: new ObjectID(id),
    _creator: req.user._id
  }).then((todo) => {
    if (todo === null) {
      return res.status(404).send();
    }
    return res.status(200).send({todo});
  }).catch((e) => {
    res.status(400).send()
  });
});

app.patch('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }
  Todo.findOneAndUpdate({
    _id: new ObjectID(id),
    _creator: req.user._id
    },
    {$set: body}, {new: true}).then((todo) => {
      if (!todo) {
        res.status(404).send();
      }
      res.send({todo});
    }).catch(e => res.status(400).send());
});

app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then(() => {
    user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send();
  });
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  if (!body.email || !body.password) {
    res.status(400).send();
  }
  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch(e => res.status(400).send());
});

app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }).catch((e) => res.status(400).send());
});

app.listen(port, () => {
  console.log('Started on port', port);
});

module.exports = {app};
