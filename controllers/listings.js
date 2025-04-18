const listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req,res) =>{
    const allListings=  await listing.find({});
    res.render("index.ejs",{allListings}) ;
  };


  module.exports.renderNewForm = (req,res) => {
    res.render("new.ejs")};


    module.exports.showListing =  async (req,res) =>{
        let {id} = req.params;
        let alldata = await listing.findById(id)
        .populate({
           path:"reviews",
           populate: {
            path: "author",
           },
        }).
        populate("owner");
        if(!alldata){
            req.flash("error", "listing you requested for does not exist");
            res.redirect("/listings");
        }
        res.render("show.ejs" , {alldata});
    }


    module.exports.createListing = async (req, res, next) => {

    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
        .send();

      let url = req.file.path;
      let filename = req.file.filename;
        const { title, description, price, location, country, image } = req.body.listing;
      
        // Ensure image.url is a string before calling trim()
        const imageUrl = image && typeof image.url === "string" ? image.url.trim() : null;
      
        const newListing = new listing({
          title,
          description,
          price,
          location,
          country,
          image: {
            filename: "DefaultImage",  // Default filename if none provided
            url: imageUrl && imageUrl !== "" ? imageUrl : "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"  // Default image URL if empty
          }
        });
      newListing.owner = req.user._id;
      newListing.image = {url,filename};

      newListing.geometry = response.body.features[0].geometry;
     let saveListing = await newListing.save();
        req.flash("success", "New listing created");
        res.redirect("/listings");
      };


      module.exports.renderEditForm = async (req,res) =>{
        let {id} = req.params;
        let alldata = await listing.findById(id);
        if(!alldata){
            req.flash("error", "listing you requested for does not exist");
            res.redirect("/listings");
        }
        let originalImageUrl= alldata.image.url;
        originalImageUrl.replace("/upload","/upload/w_250");
        res.render("edit.ejs" , {alldata,originalImageUrl});
        
    };


    module.exports.updateListing = async(req,res) =>{
        let {id}= req.params;
    let alllisting= await listing.findByIdAndUpdate(id, {...req.body.listing});
      if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
       alllisting.image = {url,filename};
        await alllisting.save();
      }
    
       req.flash("success", " listing updated");
       res.redirect(`/listings/${id}`);
    };

    module.exports.deleteListing = async(req,res) =>{
        let {id} = req.params;
       
      let akhilesh= await listing.findByIdAndDelete(id);
      req.flash("success", " listing deleted");
        res.redirect("/listings");
    
    };
    