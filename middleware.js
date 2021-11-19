const ExpressError=require('./utils/ExpressError');
const {campgroundSchema}=require('./schemas');
const Campground=require('./models/campground');
const Review=require('./models/review');
const {reviewSchema}=require('./schemas');



module.exports.validateReview=(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body);
    if(error) {
        const message=error.details.map(el=>el.message).join(',')
        throw new  ExpressError(message,400)
    }
    next();
}

module.exports.isLoggedIn= (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo=req.originalUrl
        req.flash('error', 'You must be signed in');
        res.redirect('/login')
    }
    next()
}

module.exports.validateSchema=(req,res,next)=>{
    
    const {error}=campgroundSchema.validate(req.body);
    if(error) {
        const message=error.details.map(el=>el.message).join(',')
        throw new  ExpressError(message,400)
    }

    next();
}

module.exports.isAuthor = async (req,res,next)=>{
    const {id}=req.params;
    const campground=await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
         req.flash('error', 'You do not have permission to do that.');
         return  res.redirect(`/campgrounds/${campground._id}` )        
    }
    next();
}

module.exports.isReviewAuthor = async (req,res,next)=>{
    const {id , reviewID}=req.params;
    const review=await Review.findById(reviewID);
    if(!review.author.equals(req.user._id)){
         req.flash('error', 'You do not have permission to do that.');
         return  res.redirect(`/campgrounds/${id}` )        
    }
    next();
}