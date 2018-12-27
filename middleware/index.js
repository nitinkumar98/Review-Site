// all the middleware goes here
var Campground = require("../models/campground"),
    Comment= require("../models/comment"),
 middlewarwObj ={};


middlewarwObj.checkCampgroundOwnership = function(req,res,next)
{
      //is user logged in
    if(req.isAuthenticated()){
          Campground.findById(req.params.id,function(err,foundCampground){
        if(err)
        {
            req.flash("error","Campground not found!");
            res.redirect("back");
        }
        else
        {
            //does user own campground?
            if(foundCampground.author.id.equals(req.user._id)){
                      next();
            }
            //if not,redirect
            else{
                req.flash("error","You don't have permission to do that!");
                res.redirect("back");
        }
        }
        });

    }
    //otherwise,redirect
    else
    { req.flash("error","You need to be logged in to do that!");
        res.redirect("back");
    }

}

middlewarwObj.checkCommentOwnership = function(req,res,next)
{
      //is user logged in
    if(req.isAuthenticated()){
          Comment.findById(req.params.comment_id,function(err,foundComment){
        if(err)
        {
            res.redirect("back");
        }
        else
        {
            //does user own campground?
            if(foundComment.author.id.equals(req.user._id)){
                      next();
            }
            //if not,redirect
            else{
                 req.flash("error","You don't have permission to do that!");
                res.redirect("back");
        }
        }
        });
 
    }
    //otherwise,redirect
    else
    {
        req.flash("error","You need to be logged in to do that!");
        res.redirect("back");
    }

}

middlewarwObj.isLoggedIn = function(req,res,next)
{
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You need to be logged in to do that!");
    res.redirect("/login");
}


module.exports = middlewarwObj;
