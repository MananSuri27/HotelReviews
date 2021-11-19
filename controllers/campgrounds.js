const Campground=require('../models/campground')
const {cloudinary}=require("../cloudinary")
const  mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")
const mapBoxToken=process.env.MAPBOX_TOKEN;
const geocoder=mbxGeocoding({accessToken: mapBoxToken});

module.exports.index= async (req,res)=>{
    const campgrounds=await Campground.find({});
    res.render('index', {campgrounds})
}

module.exports.renderNewForm=(req,res)=>{
    res.render('new')
}

module.exports.createCampground=async(req,res,next)=>{
    const geoData=await geocoder.forwardGeocode({
        query:req.body.campground.location,
        limit:1
    }).send()
    const campground= new Campground(req.body.campground)
    campground.geometry=geoData.body.features[0].geometry;
    campground.author=req.user._id;
    campground.images=  req.files.map(f=>({url:f.path, filename:f.filename}))
    await campground.save();
    console.log(campground);
    req.flash('success', 'Successfully made a new campground')
    res.redirect(`campgrounds/${campground._id}` )
}

module.exports.showCampground=async(req,res)=>{
    const {id}=req.params;
    const camp=await Campground.findById(id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }
        }).populate('author');
    if(!camp){
        req.flash('error', 'Cannot find that campground')
        return res.redirect('/campgrounds')
    }
    res.render('show',{camp})
}

module.exports.renderEditForm=async (req,res)=>{
    const {id}=req.params;
    const campground=await Campground.findById(id);
    if(!campground){
        req.flash('error', 'Cannot find that campground')
        return res.redirect('/campgrounds')
    }

    res.render('edit', {campground})

}

module.exports.updateCampground=async(req,res)=>{
    const {id}=req.params;
    const campground=await Campground.findByIdAndUpdate(id, {...req.body.campground});
  
    const imgs= req.files.map(f=>({url:f.path, filename:f.filename}))
    campground.images.push(...imgs) 
    await campground.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
     await campground.updateOne({$pull: {images:{ filename:{$in: req.body.deleteImages}}}})
     }
    req.flash('success', 'Successfully updated camp')
    
    res.redirect(`/campgrounds/${campground._id}` )

}

module.exports.deleteCampground=async (req,res)=>{
    const {id}=req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('Success' , 'Successfuly deleted');
    res.redirect('/campgrounds')
}