const app=require("./app");
const dotenv=require("dotenv");
const connectDatabase = require("./config/database");

//handling uncaught exception

process.on("uncaughtException",(err)=>{
  console.log(`error:${err.message}`);
  console.log("shutting down the server due to uncaught exception");
  process.exit(1);
})
 

dotenv.config({path:"backend/config/config.env"});

connectDatabase();

const server=app.listen(2000, () => {
    console.log(`Server is working on http://localhost:2000`);
  });

  //unhandled promise rejection

  process.on("unhandledRejection",err=>{
    console.log(`error:${err.message}`);
    console.log("shutting down the server due to unhandled promise rejection");
    server.close(()=>{
      process.exit(1);
    });
  });