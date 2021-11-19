const express=require('express')
const router=express.Router({mergeParams:true});
const catchAsync = require('../utils/catchAsync');
const ExpressError=require('../utils/ExpressError');
const Campground=require('../models/campground')
const Review=require('../models/review')
const {reviewSchema}=require('../schemas')
const flash=require('connect-flash')
const {isLoggedIn, isReviewAuthor, validateReview} = require('../middleware')
const reviews=require('../controllers/reviews')




router.delete('/:reviewID', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))


router.post('/', isLoggedIn, validateReview,catchAsync( reviews.postReview))

module.exports=router;
