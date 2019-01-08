const {mongoo} = require('./../server/db/mongoose');
const {User} = require('./../server/models/user');

var id = '5c3366a6bf86b507d988216c';

User.findById(id).then((user) => {
  if (user === null) {
    return console.log('Cannot find user');
  }
  console.log('User', user);
}).catch((e) => console.log(e));
