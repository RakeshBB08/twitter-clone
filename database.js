const mongoose = require("mongoose");
// mongoose.set("useNewUrlParser", true);
// mongoose.set("useUnifiedTopology", true);
// mongoose.set("useFindAndModify", false);

class Database {
  constructor() {
    this.connection();
  }
  connection() {
    mongoose
      .connect(
        "mongodb+srv://rakesh:2020657814@twitterclonecluster.rqxkksx.mongodb.net/?retryWrites=true&w=majority"
      )
      .then(() => {
        console.log("Database Connection Successful");
      })
      .catch((err) => {
        console.log("Database Connection err: " + err);
      });
  }
}

module.exports = new Database();
