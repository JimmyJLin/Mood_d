var pg = require('pg');

if(process.env.ENVIRONMENT === 'production') {
  var connectionString = process.env.DATABASE_URL
} else {
  var connectionString = {
    host: process.env.DB_HOST,
    port: 5432,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  }
}

var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);
var session = require('express-session');


function loginUser(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    var query = client.query('SELECT * FROM profile WHERE email LIKE ($1);', [email], function(err, result) {
      done();
      if(err) {
        return console.error('error running query', err);
      }
      if (result.rows.length === 0){
        res.status(204).json({success: true, data: 'no content'})
      } else if (bcrypt.compareSync(password, result.rows[0].password_digest)){
        res.rows = result.rows[0];
        next()
      }
    });
  });
};

function createSecure(email, password, callback) {
  // hashing the password given by the user at signgup
  bcrypt.genSalt( function(err, salt){
    bcrypt.hash(password, salt, function(err, hash){
      // this callback saves the user to our database
      // with the hashed password
      // saveUser(email, hash)
      callback(email, hash);
    });
  });
};


function createUser(req, res, next) {
  createSecure(req.body.email, req.body.password, saveUser);
  var name = req.body.name;
  function saveUser(email, hash){
    pg.connect(connectionString, function(err, client, done) {
      if(err) {
        done();
        console.log(err);
        return res.status(500).json({suceess: false, data: err});
      }
      var query = client.query('INSERT INTO profile( email, password_digest, name) VALUES ($1, $2, $3)', [email, hash, name], function(err, result) {
        done();
        if(err) {
          return console.error('error running query', err);
        }
        res.rows = result.rows
        next()
      });
    });
  };
};

function updateProfile(req, res, next) {
  var activity_id = req.body.activity;
  var emotion_id = req.body.emotion;
  var profile_id = req.body.profile_id;
    pg.connect(connectionString, function(err, client, done) {
      if(err) {
        done();
        console.log(err);
        return res.status(500).json({suceess: false, data: err});
      }
      var query = client.query('UPDATE profile SET emotion_id = ($1), activity_id = ($2) where profile_id = $3;', [emotion_id, activity_id, req.session.user.profile_id], function(err, result) {
        done();
        if(err) {
          return console.error('error running query', err);
        }

        res.rows = result.rows[0];
        next()
      });
    });
};

function showAllProfile(req, res, next) {
    pg.connect(connectionString, function(err, client, done) {
      if(err) {
        done();
        console.log(err);
        return res.status(500).json({suceess: false, data: err});
      }
      var query = client.query('select profile.profile_id profile_id, profile.name profile_name, activity.name activity_name, emotion.name emotion_name from profile left join emotion on profile.emotion_id = emotion.emotion_id left join activity on profile.activity_id = activity.activity_id order by profile.profile_id;', function(err, result) {
        done();
        if(err) {
          return console.error('error running query', err);
        }
        res.rows = result.rows
        next()
      });
    });
};


function showOneProfile(req, res, next) {
    pg.connect(connectionString, function(err, client, done) {
      if(err) {
        done();
        console.log(err);
        return res.status(500).json({suceess: false, data: err});
      }
      var query = client.query('select profile.profile_id profile_id, profile.name profile_name, activity.name activity_name, emotion.name emotion_name,  messages.receiver_name receiver, messages.message from profile left join emotion on profile.emotion_id = emotion.emotion_id left join activity on profile.activity_id = activity.activity_id left join messages on profile.profile_id = messages.profile_id WHERE profile.profile_id = $1;', [req.session.user.profile_id], function(err, result) {
        done();
        if(err) {
          return console.error('error running query', err);
        }
        res.rows = result.rows
        console.log('pg:' + res.rows);
        next()
      });
    });
};


function sendMessage(req, res, next) {
  console.log('Res session Message id:' + req.session.user.profile_id)
  console.log('Message body id:' + req.body)
  var message = req.body.message;
  var receiver_name = req.body.name;

    pg.connect(connectionString, function(err, client, done) {
      if(err) {
        done();
        console.log(err);
        return res.status(500).json({suceess: false, data: err});
      }
      var query = client.query('INSERT INTO messages (profile_id, message, receiver_name) VALUES ($1, $2, $3);', [req.session.user.profile_id, message, receiver_name], function(err, result) {
        done();
        if(err) {
          return console.error('error running query', err);
        }
        res.rows = result.rows
        next()
      });
    });
};

function showMessage(req, res, next) {
    pg.connect(connectionString, function(err, client, done) {
      if(err) {
        done();
        console.log(err);
        return res.status(500).json({suceess: false, data: err});
      }
      var query = client.query('select profile.profile_id profile_id, profile.name profile_name, activity.name activity_name, emotion.name emotion_name,  messages.receiver_name receiver, messages.message from profile left join emotion on profile.emotion_id = emotion.emotion_id left join activity on profile.activity_id = activity.activity_id left join messages on profile.profile_id = messages.profile_id WHERE profile.profile_id = $1;', [req.session.user.profile_id], function(err, result) {
        done();
        if(err) {
          return console.error('error running query', err);
        }
        res.rows = result.rows
        console.log('pg:' + res.rows);
        next()
      });
    });
};

module.exports.showMessage = showMessage;
module.exports.sendMessage = sendMessage;
module.exports.showOneProfile = showOneProfile;
module.exports.updateProfile = updateProfile;
module.exports.showAllProfile = showAllProfile;
module.exports.loginUser = loginUser;
module.exports.createUser = createUser;
