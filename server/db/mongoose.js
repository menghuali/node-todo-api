var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

if (process.env.PORT) {
  mongoose.connect('mongodb://user1:1QazxsW2@ds119750.mlab.com:19750/sandbox1', { useNewUrlParser: true });
} else {
  mongoose.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true });
}

module.exports = {
  mongoose
};
