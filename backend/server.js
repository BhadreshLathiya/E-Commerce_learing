const app = require('./app')
const dotenv = require('dotenv')
const connectDatabase = require('./config/database')
const cloudinary = require('cloudinary')

//Handling uncaught Exception
process.on("uncaughtException",(err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to uncaught Exception`)
    process.exit(1);
})

//config
dotenv.config({path:"backend/config/config.env"})

//Connecting to database
connectDatabase()
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});

const server =  app.listen(process.env.PORT,() => {
    console.log(`server is running on ${process.env.PORT}`)
})

//unhandled Promise Rejection
process.on("unhandledRejection", err=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to unhandel promise Rejection`)

    server.close(() => {
        process.exit(1);
    })
})