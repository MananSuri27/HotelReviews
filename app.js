if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

const express=require('express');
const app=express();
const path=require('path')
const Joi=require('joi')
const Review=require('./models/review')
const {campgroundSchema, reviewSchema}=require('./schemas')
const mongoose=require('mongoose')
const methodOverride=require('method-override')
const Campground=require('./models/campground')
const ejsMate=require('ejs-mate')
const catchAsync = require('./utils/catchAsync');
const ExpressError=require('./utils/ExpressError');
const { stat } = require('fs');
const session=require('express-session');
const flash=require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User=require('./models/user')

const userRoute=require('./routes/users')
const campgroundRoute=require('./routes/campgrounds')
const reviewRoute=require('./routes/reviews')



mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser:true,
    //useCreateIndex:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log('Connection open')
})
.catch(error => console.log(error));

app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname,'public')))


const sessionConfig={
    secret:'sl0wL1kePs3udoeph3dr1n3',
    resave:false,
    saveUninitialised:true,
    cookie:{
        httpOnly:true,
        expires:Date.now() + 1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());






app.engine('ejs',ejsMate)
app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'))


app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.success=req.flash('success')
    res.locals.error=req.flash('error')
    next()
})
app.get('/fakeUser', async (req,res)=>{
    const user=new User({email:'sth@sth.com', username:'manan'});
    const newUser=await User.register(user, 'chicken');
    res.send(newUser)
})

app.use('/', userRoute)
app.use('/campgrounds', campgroundRoute)
app.use('/campgrounds/:id/reviews',reviewRoute)


app.get('/',(req,res)=>{
    res.render('home')
})



app.all('*', (req,res,next)=>{
    next(new ExpressError('Page not found',404))
})

app.use((err,req,res,next)=>{
    const {statusCode=500, message="Something went wrong"}=err;
    res.status(statusCode)
    if(!err.message) err.message="Something went wrong";
 res.render('error',{err})
})

app.listen(3000, ()=>{
    console.log('serving on port 3000')
})