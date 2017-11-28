var express = require('express');
var router = express.Router();

var User = require('../db/schema/user');
var Consulting = require('../db/schema/consulting');

var isAuthenticated = require('../utils/utils');

router.use(isAuthenticated);

router.get('/dates-enabled', function(req, res, next) {
  //This can be storage in database
  var dates = [
    '2017-12-02',
    '2017-12-09',
    '2017-12-16',
    '2017-12-23',
    '2017-12-30'
  ];

  var hours = [8, 10, 14, 16];

  res.json({
    dates_enableds: dates,
    hours_enableds: hours
  });
});


/* Schedule consulting. */
router.post('/schedule', checkIfDateIsAvaiable, function(req, res, next) {
  var data = req.body;

  User.findById(data.user._id, function(err, user) {
    if (err) next(err);

    var consulting = new Consulting({
      date: new Date(data.date),
      user: user
    });

    consulting.save(function(err, data) {
      if (err) return res.status(400).json({
        error: 'Consulting saved error'
      });
      res.set(setHeaderSuccessMessage('Consulting schedule with success!'));
      return res.status(200).json(data);
    });
  });
});



/* Get my consultings. */
router.post('/my-consultings', function(req, res, next) {
  var data = req.body;

  Consulting.find({
    user: data.userId
  }, "_id date").exec(function(err, consultings) {
    if (err) next(err);
    return res.status(200).send(consultings);
  });
});


/* Unchek consulting. */
router.delete('/:id/uncheck', function(req, res, next) {
  var consultingId = req.params.id;

  Consulting.remove({
    _id: consultingId,
    user: req.user._id
  }).exec(function(err) {
    if (err) {
      res.set(setHeaderErrorMessage("Could not delete the consulting"));
      return res.status(400).send();
    };
    res.set(setHeaderSuccessMessage("consulting removed with sucess"));
    return res.status(200).json({});
  });
});


function checkIfDateIsAvaiable(req, res, next) {
  var date = new Date(req.body.date);
  Consulting.findOne({
    date: date
  }, function(err, data) {
    if (err) next(err);
    if (data) {
      res.set(setHeaderErrorMessage("There is consulting for this date!"));
      return res.send(400);
    }
    next();
  });
}

function setHeaderSuccessMessage(msg) {
  return {
    'msg': msg
  }
}

function setHeaderErrorMessage(msg) {
  return {
    'error-msg': msg
  }
}


module.exports = router;
