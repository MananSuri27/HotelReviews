const express=require('express')
const router=express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError=require('../utils/ExpressError');
const Campground=require('../models/campground')
const {campgroundSchema}=require('../schemas')
const flash=require('connect-flash')



const validateSchema=(req,res,next)=>{
    
    const {error}=campgroundSchema.validate(req.body);
    if(error) {
        const message=error.details.map(el=>el.message).join(',')
        throw new  ExpressError(message,400)
    }

    next();
}



router.get('/',catchAsync(async (req,res)=>{
    const campgrounds=await Campground.find({});
    res.render('index', {campgrounds})
}))

router.get('/new', (req,res)=>{
    res.render('new')
})


router.post('/',validateSchema,catchAsync(async(req,res,next)=>{
    const campground= new Campground(req.body.campground)
    await campground.save()
    req.flash('success', 'Successfully made a new campground')
    res.redirect(`campgrounds/${campground._id}` )
}))



router.get('/:id/edit', catchAsync(async (req,res)=>{
    const {id}=req.params;
    const campground=await Campground.findById(id);
    if(!campground){
        req.flash('error', 'Cannot find that campground')
        return res.redirect('/campgrounds')
    }
    res.render('edit', {campground})

}))

router.put('/:id',validateSchema,catchAsync( async(req,res)=>{
    const {id}=req.params;
    const campground= await Campground.findByIdAndUpdate(id,{...req.body.campground})
    req.flash('success', 'Successfully updated camp')
    res.redirect(`/campgrounds/${campground._id}` )

}))


router.get('/:id', catchAsync(async(req,res)=>{
    const {id}=req.params;
    const camp=await Campground.findById(id).populate('reviews');
    if(!camp){
        req.flash('error', 'Cannot find that campground')
        return res.redirect('/campgrounds')
    }
    res.render('show',{camp})
}))

router.delete('/:id', catchAsync(async (req,res)=>{
    const {id}=req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds')
}))

module.exports=router;
