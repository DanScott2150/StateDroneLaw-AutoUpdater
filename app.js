// StateDroneLaw.com Auto-Updater
// Integrates with StateDroneLaw.com WordPress backend (via WP REST API & Oauth authentication)

// Core functionality:
// -- Use the OpenStates.org API to find drone-related laws
// -- Search StateDroneLaw.com to see if given laws are already posted on the site
// -- If not, publish the law to StateDroneLaw.com

// ** Heavy lifting happens in the ./middleware/autoUpdater.js file **

const express     = require('express'),
      app         = express(),
      middleware  = require('./middleware'),
      autoUpdater  = require('./middleware/autoUpdater');

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));


//Dashboard homepage route
app.get("/", function(req, res){
    res.render("index");
});

// Display all laws
// Semi-placeholder for now
app.get("/laws", function(req, res){
    res.render("laws/index");
});

//"Add New Law" form page
// Accessed when user clicks "Add" on a law after running the updater
app.get("/laws/new", function(req, res){
    res.render("laws/new");
});

// View a single law that's on StateDroneLaw.com
// Semi-placeholder for now... not really sure if there's any value in keeping this
// Middleware function uses WordPress postID to find the specified law, then makes WP API call to pull all the data
app.get("/laws/:id", middleware.findCurrentLaw, function(req, res){
  res.render('laws/show', {law: res.locals.currentLaw})
});

// AUTO-UPDATER routes (where the magic happens)

  // Updater index page, includes button to "Run Updater"
  app.get("/updater", function(req, res){
    res.render("updater/index");
  });

  // When user clicks "Run Updater", trigger the updater
  // autoUpdater.runUpdater() makes the API calls to OpenStates, and returns relevant laws
  // autoUpdater.checkChanges() makes the API calls to StateDroneLaw via WordPress, checks which laws already exist on the site
  app.get("/updater/run", autoUpdater.runUpdater, autoUpdater.checkChanges, function(req, res){
    res.render("updater/results", {
      allBills: res.locals.allResults,
      newLaws: res.locals.newResults,
      existingLaws: res.locals.existingResults
    })
  });

//Edit law route (placeholder)
app.get("/laws/:id/edit", function(req, res){
  console.log("Edit route");
});

//Launch server
app.listen(3000, function(){
    console.log("Server Has Launched");
});