const axios = require('axios');
const CryptoJS = require('crypto-js');
const { OAuth2Client } = require('google-auth-library');

const nano = require('nano')('http://admin:1sE7QqOM6w44@51.144.121.173:5984');

//Databases
const sportestDB = nano.db.use('sportest');
const userDB = nano.db.use('_users');

/*****Functions ******/

async function getToken(usern) {
  let tok = CryptoJS.HmacSHA1(usern, await getSecret());
  tok = tok.toString();

  //Convert to hex for database-per-user
  let dbn = 'userdb-' + Buffer.from(usern, 'utf8').toString('hex');

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
    'http://admin:1sE7QqOM6w44@51.144.121.173:5984/_node/couchdb@127.0.0.1/_config/couch_httpd_auth/secret',
  );

  return res.data;
}

/*** Google Authentication ***/
const client = new OAuth2Client(
  //ÄNDERN WENN ANDERER ACCOUNT ZUM AUTHENTIFIZIEREN BENUTZT WIRD
  '545491340068-hb3lse39ve85bsgsoatc53luofqs6vb7.apps.googleusercontent.com',
);
async function verifyUser(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience:
      '545491340068-hb3lse39ve85bsgsoatc53luofqs6vb7.apps.googleusercontent.com', // Specify the CLIENT_ID of the app that accesses the backend
  });
  const payload = ticket.getPayload();

  return payload['email'];
}

module.exports = {
  getToken,
  getUser,
  createUser,
  verifyUser,
};
