const express       = require('express'),
      app           = express(),
      axios         = require("axios"),
      middlewareObj = {};

//Create 'law' object for a given law (based on WordPress custom post type)
// Not really used for now
middlewareObj.findCurrentLaw = function(req, res, next){
  var baseURL = 'https://statedronelaw.com';
  var restURL = baseURL + `/wp-json/wp/v2/laws/${req.params.id}?_embed`;

  axios.get(restURL)
  .then(function (response) {
    // console.log(response.data);
    var responseData = response.data;
    res.locals.currentLaw = responseData;
    next();
  })
  .catch(function (error) {
    console.log(error);
  })
  .then(function () {
    // always executed
  });
}

module.exports = middlewareObj;