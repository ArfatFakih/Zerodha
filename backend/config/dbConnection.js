const mongoose = require('mongoose');

const connectDb = async () => {
    try{
        const connect = await mongoose.connect(process.env.MONGO_URL);
        console.log("Database Connected");
    }catch(err){
        console.log(err);
    }
}

module.exports = connectDb;