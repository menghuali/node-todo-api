var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var url = process.env.MONGODB_URI;
console.log('mongodb url ', url);
mongoose.connect(url, { useNewUrlParser: true });

module.exports = {
  mongoose
};
