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

// In termimal, set heroku PROD configuration
// $ heroku config:set MONGODB_URI=mongodb://user1:1QazxsW2@ds119750.mlab.com:19750/sandbox1
// $ heroku config:set JWT_SECRETE=salt789

// Check heroku configuration
// $ heroku config
// === calm-island-14371 Config Vars
// JWT_SECRETE: salt789
// MONGODB_URI: mongodb://user1:1QazxsW2@ds119750.mlab.com:19750/sandbox1
