const axios = require('axios');
const CryptoJS = require('crypto-js');


const nano = require('nano')('http://admin:1sE7QqOM6w44@localhost:5984');

//Databases
const sportestDB = nano.db.use('sportest');
const userDB = nano.db.use('_users');

nano.db
  .get('sportest')
  .then(body => {
    console.log(body.db_name);
  })
  .catch(error => {
    console.log(error);
  });

getToken();

/*****Functions ******/

function getToken(username) {

  var token = CryptoJS.HmacSHA1('schueler', 'eb64b3fa40833c1643342aa5fe525665');
}

async function createUser(username, isLehrer) {
  if (isLehrer) {
  } else {
    let res = await userDB.insert({
      _id: `org.couchdb.user:${username}`,
      name: username,
      type: 'user',
      roles: ['schueler'],
      password: Math.random().toString(36).slice(-8),
    });
    res.username = username;
    return res;
  }
}

async function getUser(username) {
  try {
    let res = await userDB.get(`org.couchdb.user:${username}`);
    return true;
  } catch (error) {
      return false;
  }
}

async function getSecret() {
  let res = await axios.get(
    'http://admin:1sE7QqOM6w44@localhost:5984/_node/couchdb@127.0.0.1/_config/couch_httpd_auth/secret',
  );

  return res.data;
}

//Convert to hex for database-per-user
Buffer.from('schueler', 'utf8').toString('hex');
