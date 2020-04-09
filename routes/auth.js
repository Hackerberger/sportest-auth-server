var express = require('express');
var router = express.Router();
const {
  getToken,
  getUser,
  createUser,
  verifyUser,
} = require('../model/model_auth');

/* GET home page. */
router.post('/token', async function (req, res, next) {
  if (req.body.email === undefined || req.body.token === undefined)
    res.status(400).end();
  else {
    if (req.body.email.split('@')[1] == 'htlwienwest.at') {
      try {
        let em = await verifyUser(req.body.token);
        if (em == req.body.email) {
          let username = req.body.email.split('@')[0];
          if (await getUser(username)) {
            res.send(await getToken(username));
          } else {
            await createUser(username);
            res.send(await getToken(username));
          }
        }
        else{
          res.send('Account Email does not match: ' + req.body.email).status(401);
        }
      } catch (error) {
        res.send(error).status(500);
      }
    } else {
      res.send('Unauthorized Email address: ' + req.body.email).status(401);
    }
  }
});

module.exports = router;
