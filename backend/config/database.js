const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose
    .connect("mongodb+srv://pri8394chaudhary:priya8394@cluster0.6wunzf9.mongodb.net/", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      
    })
    .then((data) => {
      console.log(`Mongodb connected with server: ${data.connection.host}`);
    });
};

module.exports = connectDatabase;