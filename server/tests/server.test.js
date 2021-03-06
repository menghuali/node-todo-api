const request = require('supertest');
const expect = require('expect');
const {ObjectID} = require('mongodb');
const {app} = require('./../server.js');
const {Todo} = require('./../models/todo.js');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');
const jwt = require('jsonwebtoken');

// Interesting feature. Can be used for event engine?
beforeEach(populateUsers);
beforeEach(populateTodos);

var wrongToken = jwt.sign(
  { _id: new ObjectID(), access: 'auth' },
  process.env.JWT_SECRETE).toString();

describe('POST /todos', () => {
  it('should get 401 if no authentication', (done) => {
    request(app).post('/todos').expect(401).end(done);
  });

  it('should get 401 if not authenticated', (done) => {
    request(app).post('/todos')
      .set('x-auth', wrongToken)
      .expect(401).end(done);
  });

  it('should create a new todo', (done) => {
    var text = 'Test todo text';
    request(app).post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({
        text
      }).expect(200).expect((res) => {
        expect(res.body.text).toBe(text);
      }).end((err) => {
        if (err) {
          return done(err);
        }
        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create todo with invalid body', (done) => {
    request(app).post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({ text: '   ' })
      .expect(400).end((err) => {
        if (err) {
          return done(err);
        }
        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((err) => done(err));
      });
  });
});

describe('GET /todos', () => {
  it('should get 401 if no authentication', (done) => {
    request(app).get('/todos').expect(401).end(done);
  });

  it('should get 401 if not authenticated', (done) => {
    request(app).get('/todos')
      .set('x-auth', wrongToken)
      .expect(401).end(done);
  });

  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        var _todos = res.body.todos;
        expect(_todos.length).toBe(1);
        expect(_todos[0].text).toBe(todos[0].text);
      }).end(done);
  });
});

describe('GET /todos/:id', () => {
  var _expect = todos[0];

  it('should get 401 if no authentication', (done) => {
    request(app).get('/todos/123').expect(401).end(done);
  });

  it('should get 401 if not authenticated', (done) => {
    request(app).get('/todos/123')
      .set('x-auth', wrongToken)
      .expect(401).end(done);
  });

  it('should return todo', (done) => {
    request(app)
      .get(`/todos/${_expect._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(_expect.text);
      })
      .end(done);
  });

  it('should not return todo created by other user',
    (done) => {
      request(app)
        .get(`/todos/${todos[1]._id.toHexString()}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);
    });

  it('should return 404 if todo not found', (done) => {
    request(app)
      .get(`/todos/${new ObjectID().toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', (done) => {
    request(app)
      .get('/todos/123')
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('should get 401 if no authentication', (done) => {
    request(app).delete('/todos/123').expect(401).end(done);
  });

  it('should get 401 if not authenticated', (done) => {
    request(app).delete('/todos/123')
      .set('x-auth', wrongToken)
      .expect(401).end(done);
  });

  it('should return 404 because of invalid object ID', (done) => {
    request(app)
      .delete('/todos/123')
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 because data not found', (done) => {
    request(app)
      .delete(`/todos/${new ObjectID().toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 200 when data found', (done) => {
    request(app)
      .delete(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        var actual = res.body.todo;
        expect(actual._id).toBe(todos[0]._id.toHexString());
        expect(actual.text).toBe(todos[0].text);
      }).end((err) => {
        if(err) {
          return done(err);
        }
        Todo.findById(todos[0]._id.toHexString()).then((todo) => {
          expect(todo).toBeFalsy();
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not delete todo created by other user',
    (done) => {
      request(app)
        .delete(`/todos/${todos[1]._id.toHexString()}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end((err) => {
          if(err) {
            return done(err);
          }
          Todo.findById(todos[1]._id.toHexString()).then((todo) => {
            expect(todo).toBeTruthy();
            done();
          }).catch((e) => done(e));
        });
    });

});

describe('PATCH /todos/:id', () => {
  it('should get 401 if no authentication', (done) => {
    request(app).patch('/todos/123').expect(401).end(done);
  });

  it('should get 401 if not authenticated', (done) => {
    request(app).patch('/todos/123')
      .set('x-auth', wrongToken)
      .expect(401).end(done);
  });

  it('should return 404 if todo ID is invalid', (done) => {
    request(app)
      .patch('/todos/123')
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 if todo is not found', (done) => {
    request(app)
      .patch(`/todos/${new ObjectID().toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  var id = todos[0]._id.toHexString();

  it('should return updated text only if todo is not completed', (done) => {
    request(app)
      .patch(`/todos/${id}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({
        text: 'text1',
        completed: false,
        misc: 'misc'
      })
      .expect(200)
      .expect((res) => {
        var actual = res.body.todo;
        expect(actual._id).toBe(id);
        expect(actual.text).toBe('text1');
        expect(actual.completed).toBe(false);
        expect(actual.msic).toBe(undefined);
        expect(actual.completedAt).toBe(null);
      }).end((err) => {
        if (err) {
          return done(err);
        }
        Todo.findById(id).then((todo) => {
          expect(todo._id.toHexString()).toBe(id);
          expect(todo.text).toBe('text1');
          expect(todo.completed).toBe(false);
          expect(todo.msic).toBe(undefined);
          expect(todo.completedAt).toBe(null);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should return updated todo if it completed and found', (done) => {
    request(app)
      .patch(`/todos/${id}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({
        text: 'text2',
        completed: true,
        misc: 'misc'
      })
      .expect(200)
      .expect((res) => {
        var actual = res.body.todo;
        expect(actual._id).toBe(id);
        expect(actual.text).toBe('text2');
        expect(actual.completed).toBe(true);
        expect(actual.misc).toBe(undefined);
        expect(typeof actual.completedAt).toBe('number');

      }).end((err) => {
        if (err) {
          return done(err);
        }
        Todo.findById(id).then((todo) => {
          expect(todo._id.toHexString()).toBe(id);
          expect(todo.text).toBe('text2');
          expect(todo.completed).toBe(true);
          expect(todo.msic).toBe(undefined);
          expect(typeof todo.completedAt).toBe('number');
          done();
        }).catch((e) => done(e));
      });
  });

  it('should return 404 when updating the todo created by other user', (done) => {
    request(app)
      .patch(`/todos/${todos[1]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({
        text: 'text2',
        completed: true,
        misc: 'misc'
      })
      .expect(404)
      .end((err) => {
        if (err) {
          return done(err);
        }
        Todo.findById(todos[1]._id.toHexString())
          .then((todo) => {
            expect(todo.text).toBe(todos[1].text);
            expect(todo.completed).toBe(false);
            expect(todo.completedAt).toBeFalsy();
            done();
          }).catch((e) => done(e));
      });
  });
});

describe('POST /users', () => {
  it('it should return 400 if the email is null', (done) => {
    request(app).post('/users').send({
      password: 'password!'
    }).expect(400).end(done);
  });

  it('it should return 400 if the email is invalid', (done) => {
    request(app).post('/users').send({
      email: 'invalid',
      password: 'password!'
    }).expect(400).end(done);
  });

  it('it should return 400 if the email is already used', (done) => {
    request(app).post('/users').send({
      email: users[0].email,
      password: 'password!'
    }).expect(400).end(done);
  });

  it('it should return 400 if the password is null', (done) => {
    request(app).post('/users').send({
      email: 'mli@gmail.com'
    }).expect(400).end(done);
  });

  it('it should return 400 if the password is too short', (done) => {
    request(app).post('/users').send({
      email: 'mli@gmail.com',
      password: 'pass!'
    }).expect(400).end(done);
  });

  it('it should create user and return authentication token', (done) => {
    var email = 'charlie@gmail.com';
    var password = 'password!';
    var token, id;
    request(app).post('/users').send({
      email, password
    }).expect(200)
      .expect((res) => {
        expect(res.body.email).toBe(email);
        id = res.body._id;
        expect(id).toBeTruthy();
        expect(ObjectID.isValid(id)).toBe(true);
        token = res.header['x-auth'];
        expect(token).toBeTruthy();
      }).end((err) => {
        if (err) {
          return done(err);
        }
        if (token) {
          User.findByToken(token).then((user) => {
            expect(user.email).toBe(email);
            expect(user._id.toHexString()).toBe(id);
            expect(password).not.toBe(user.password);
            done();
          }).catch((e) => done(e));
        }
      });
  });
});

describe('GET /users/me', () => {
  it('should return 401 if no authentication', (done) => {
    request(app).get('/users/me').send().expect(401).end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    request(app).get('/users/me').set('x-auth', 'abcd').send().expect(401).end(done);
  });

  it('should return a user if authenticated', (done) => {
    request(app).get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .send()
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
        expect(res.body.password).toBeFalsy();
    }).end(done);
  });
});

describe('POST /users/login', () => {
  var email = users[0].email;
  var password = 'userOnePass';
  var id = users[0]._id.toHexString();

  it('should return 400 if email is missing', (done) => {
    request(app).post('/users/login').send({password}).expect(400).end(done);
  });

  it('should return 400 if password is missing', (done) => {
    request(app).post('/users/login').send({email}).expect(400).end(done);
  });

  it('should return 400 if user is not found', (done) => {
    request(app).post('/users/login').send({
      email: 'dummy@gamil.com',
      password
    }).expect(400).end(done);
  });

  it('should return 400 if password is wrong', (done) => {
    request(app).post('/users/login').send({
      email,
      password: 'wrong@password'
    }).expect(400).end(done);
  });

  it('shoould return user and auth token if credential is correct', (done) => {
    var token;
    request(app).post('/users/login').send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(id);
        expect(res.body.email).toBe(email);
        expect(res.body.password).toBeFalsy();
        expect(res.header['x-auth']).toBeTruthy();
        token = res.header['x-auth'];
      })
      .end((err) => {
        if (err) {
          return done(err);
        }
        // Test that the user can be found by the returned token.
        User.findByToken(token).then((user) => {
          expect(user.email).toBe(email);
          expect(user._id.toHexString()).toBe(id);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('DELETE /users/me/token', () => {
  var token = users[0].tokens[0].token;
  it('should delete the token', (done) => {
    request(app).delete('/users/me/token').set('x-auth', token).send()
    .expect(200)
    .end((err) => {
      if (err) {
        return done(err);
      }
      User.findById(users[0]._id).then((user) => {
        expect(user).toBeTruthy();
        expect(user.tokens.length).toBe(0);
        request(app).get('/users/me')
          .set('x-auth', token)
          .send()
          .expect(401).end(done);
      }).catch((e) => done(e));
    });
  });
});
