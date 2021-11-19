const Review=require('../models/review')
const Campground=require('../models/campground')


module.exports.deleteReview=async (req,res)=>{
    const {id,reviewID}=req.params;
    await Campground.findByIdAndUpdate(id, {$pull:{reviews:reviewID}});
    await Review.findByIdAndDelete(reviewID)
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/campgrounds/${id}`)
}

module.exports.postReview= async(req,res)=>{
    const {id}=req.params;
    const campground= await Campground.findById(id);
    const review=new Review(req.body.review)
    review.author=req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Review posted')
    res.redirect( `/campgrounds/${id}`);
}