var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var url = process.env.PORT ? 'mongodb://user1:1QazxsW2@ds119750.mlab.com:19750/sandbox1' : 'mongodb://localhost:27017/TodoApp';
console.log('mongodb url ', url);
mongoose.connect(url, { useNewUrlParser: true });

module.exports = {
  mongoose
};
