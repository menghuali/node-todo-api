var env = process.env.NODE_ENV || 'dev';
// console.log('env ********: ', env);

if (env === 'dev') {
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
} else if (env === 'test') {
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
} else {
  process.env.MONGODB_URI = 'mongodb://user1:1QazxsW2@ds119750.mlab.com:19750/sandbox1';
}
