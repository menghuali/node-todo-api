const request = require('supertest');
const expect = require('expect');
const {ObjectID} = require('mongodb');

const {app} = require('./../server.js');
const {Todo} = require('./../models/todo.js');

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

// Interesting feature. Can be used for event engine?
beforeEach((done) => {
  Todo.deleteMany({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
});

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';
    request(app).post('/todos').send({
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
    request(app).post('/todos').send({ text: '   ' })
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
  it('should get all todos', (done) => {
    request(app).get('/todos')
      .expect(200)
      .expect((res) => {
        var _todos = res.body.todos;
        expect(_todos.length).toBe(2);
        expect(_todos[0].text).toBe(todos[0].text);
        expect(_todos[1].text).toBe(todos[1].text);
      }).end(done);
  });
});

describe('GET /todos/:id', () => {
  var _expect = todos[0];
  console.log(`/todos/${_expect._id.toHexString()}`);
  it('should return todo', (done) => {
    request(app).get(`/todos/${_expect._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(_expect.text);
      })
      .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    request(app).get(`/todos/${new ObjectID().toHexString()}`)
      .expect(404).end(done);
  });

  it('should return 404 for non-object ids', (done) => {
    request(app).get('/todos/123').expect(404).end(done);
  });
});
