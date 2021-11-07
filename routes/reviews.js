const express=require('express')
const router=express.Router({mergeParams:true});
const catchAsync = require('../utils/catchAsync');
const ExpressError=require('../utils/ExpressError');
const Campground=require('../models/campground')
const Review=require('../models/review')
const {reviewSchema}=require('../schemas')
const flash=require('connect-flash')


const validateReview=(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body);
    if(error) {
        const message=error.details.map(el=>el.message).join(',')
        throw new  ExpressError(message,400)
    }
    next();
}


router.delete('/:reviewID', catchAsync(async (req,res)=>{
    const {id,reviewID}=req.params;
    await Campground.findByIdAndUpdate(id, {$pull:{reviews:reviewID}});
    await Review.findByIdAndDelete(reviewID)
    res.redirect(`/campgrounds/${id}`)
}))



router.post('/', validateReview, async(req,res)=>{
    const {id}=req.params;
    const campground= await Campground.findById(id);
    const review=new Review(req.body.review)
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Review posted')
    res.redirect( `/campgrounds/${id}`);
})

module.exports=router;
