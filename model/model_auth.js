const axios = require('axios');
const CryptoJS = require('crypto-js');

const nano = require('nano')('http://admin:1sE7QqOM6w44@localhost:5984');

//Databases
const sportestDB = nano.db.use('sportest');
const userDB = nano.db.use('_users');

/* nano.db
  .get('sportest')
  .then(body => {
    console.log(body.db_name);
  })
  .catch(error => {
    console.log(error);
  }); */

/*****Functions ******/

async function getToken(usern) {
  let tok = CryptoJS.HmacSHA1(usern, await getSecret());
  tok = tok.toString();

  //Convert to hex for database-per-user
  let dbn = 'userdb-' + Buffer.from(usern, 'utf8').toString('hex');

  console.log({
    username: usern,
    token: tok,
    dbname: dbn,
  });
  return {
    username: usern,
    token: tok,
    dbname: dbn,
  };
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


module.exports = {
  getToken,getUser,createUser
}