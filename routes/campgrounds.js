var express = require("express"),
    router  = express.Router(),
    Campground = require("../models/campground"),
    middleware = require("../middleware");

//NEW - show form to create a new campground
router.get("/new",middleware.isLoggedIn,function(req, res) {
   res.render("campgrounds/new");
});


// SHOW - show info about any particular  campground
router.get("/:id",function(req, res) {
    //find the campground with provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
             //render show template with that campground
             //console.log(foundCampground);
            res.render("campgrounds/show",{campground:foundCampground});
        }
    });


});
//INDEX - show all the campgrounds from DB
router.get("/",function(req,res)
{

      // Get all the campgrounds from db
      Campground.find({},function(err,allcampgrounds)
      {
         if(err)
         {
             console.log(err);
         }
         else
         {
           res.render("campgrounds/index",{campgrounds:allcampgrounds});
         }
      });

}); 

//CREATE - Add new campground to the DB
router.post("/",middleware.isLoggedIn,function(req,res){

   //get data from form and add to the database
   var name=req.body.name;
   var image=req.body.image;
   var price = req.body.price;
    var desc=req.body.description;
     var author ={
       id:req.user._id,
       username:req.user.username
   };
   var newCampground = {  name: name,image: image,price:price,description:desc,author:author };

   //create a new campground and save to the DB
   Campground.create(newCampground,function(err,newlyCreated)
   {
      if(err)
      {
          console.log(err);
      }
      else{
          //redirect back to campground page

          res.redirect("/campgrounds");
      }
   });
});


// EDIT CAMPGROUND ROUTES
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req, res) {

          Campground.findById(req.params.id,function(err,foundCampground){
                res.render("campgrounds/edit",{campground:foundCampground});
          });
});

//UPDATE CAMPGROUND ROUTES

router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
   //find and update the correst campground
   Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
       if(err)
       {
           res.redirect("/campgrounds");
       }else{
           //redirect somewhere(show page)
           res.redirect("/campgrounds/"+ req.params.id);
       }
   });

});


// DESTROY CAMPGROUNDS ROUTES
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
   Campground.findByIdAndRemove(req.params.id,function(err){
      if(err)
      {
          res.redirect("back");

      }else
      {
          res.redirect("/campgrounds");
      }
   });
});

module.exports = router;
