var express       = require("express"),
    app           = express(),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
    passport      = require("passport"),
    flash         = require("connect-flash"),
    LocalStrategy = require("passport-local"),
    Campground    = require("./models/campground"),
    methodOverride  = require("method-override"),
    seedDB        = require("./seeds"),
    User          = require("./models/user"),
    Comment       = require("./models/comment"),
    moment        =require("moment");


//required routes files
 var commentRoutes     = require("./routes/comments"),
     campgroundRoutes  = require("./routes/campgrounds"),
     indexRoutes       = require("./routes/index");


var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp"
 mongoose.connect(url);
//mongoose.connect("mongodb://Nitin:everything123@ds123783.mlab.com:23783/yelpcamp_2");

app.use(bodyParser.urlencoded({extended :true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

 //seedDB(); // seed the database

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret:"This is going to be very interesting!",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
   res.locals.currentUser  = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();

});

/// required routes
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use(indexRoutes);

app.listen(process.env.PORT,process.env.IP,function()
{
   console.log("The YelpCamp server has been started");
});
