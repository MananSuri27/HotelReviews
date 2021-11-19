const mongoose=require('mongoose')
const Campground=require('../models/campground')
const cities=require('./cities')
const {places,descriptors}=require('./seedHelpers')
mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser:true,
    //useCreateIndex:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log('Connection open')
})
.catch(error => console.log(error));

const sample = array=> array[Math.floor(Math.random()*array.length)];

const seedDB=async ()=>{
    await Campground.deleteMany({});
    for(let i=0;i<500;i++){
        const random1000= Math.floor(Math.random()*1000)
        const price=Math.floor(Math.random()*30)  +10;
        const camp=new Campground({
            author:'618ba86a37ab03e90b1e606c',
            title:`${sample(descriptors)} ${sample(places)} `,
            location:`${cities[random1000].city}, ${cities[random1000].state}`,
            geometry: { type: 'Point', coordinates: [ cities[random1000].longitude,cities[random1000].latitude] },
            images: [
                {
                  url: 'https://res.cloudinary.com/dfp0fy2iw/image/upload/v1637157910/YelpCamp/rnz7o7d8bqdzk2mfhazc.png',
                  filename: 'YelpCamp/rnz7o7d8bqdzk2mfhazc',
                },
                {
                  url: 'https://res.cloudinary.com/dfp0fy2iw/image/upload/v1637157912/YelpCamp/pyimqznslo8309boncle.png',
                  filename: 'YelpCamp/pyimqznslo8309boncle',
                },
                {
                  url: 'https://res.cloudinary.com/dfp0fy2iw/image/upload/v1637157913/YelpCamp/ke95ood8r1y5lhtuzz3q.jpg',
                  filename: 'YelpCamp/ke95ood8r1y5lhtuzz3q',
                }
              ],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis ea vel aperiam sapiente placeat! Velit, optio quo maiores ullam neque, quidem veritatis, iste cum quos assumenda rem eaque numquam aspernatur.'
            ,price
        })

        await camp.save();
    }

}


seedDB();