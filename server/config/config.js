var env = process.env.NODE_ENV || 'dev';
if(env === 'dev' || env === 'test') {
  var config = require('./config.json');
  var envConfig = config[env];
  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
  });
}
// else {
//   process.env.MONGODB_URI = 'mongodb://user1:1QazxsW2@ds119750.mlab.com:19750/sandbox1';
// }
