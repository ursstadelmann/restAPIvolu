/**
This file handles the connection to the MongoDB.
*/

//get mongoose into the file
const mongoose = require('mongoose');

//get MongoDB link
const mongoDBlink = require('../../common/config/mongoDB.config.js').mongoDBlink;

//counter-variable for connection-tries
let count = 0;

//verify the MongoDB connection options.
const options = {
   autoIndex: false, // Don't build indexes
   poolSize: 10, // Maintain up to 10 socket connections
   //If not connected, return errors immediately rather than waiting for reconnect
   bufferMaxEntries: 0,
   // all other approaches are now deprecated by MongoDB:
   useNewUrlParser: true,
   useUnifiedTopology: true

};

//make the connection to MongoDB.
const connectWithRetry = () => {
    console.log('MongoDB connection with retry')
    mongoose.connect(mongoDBlink, options).then(()=>{
        console.log('MongoDB is connected')
    }).catch(err=>{
        console.log('MongoDB connection unsuccessful, retry after 5 seconds. ', ++count);
        setTimeout(connectWithRetry, 5000)
    })
 };

connectWithRetry();

exports.mongoose = mongoose;