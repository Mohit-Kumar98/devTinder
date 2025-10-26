const mongoose = require("mongoose");

// Url needed to connect to mongodb cluster.

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://mohitkumar98clg_db_user:0kPc4AnRs4ZQhu7a@namastenode.fiangs2.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
