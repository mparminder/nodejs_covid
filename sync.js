const scrapper = require('./app/controllers/scrapper');
const db = require("./app/models");
const cron = require('node-cron');
function connectDb() {
  return new Promise((resolve, reject) => {

    db.mongoose
      .connect(db.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      .then(() => {
        console.log("Connected to the database!");
      })
      .catch(err => {
        console.log("Cannot connect to the database!", err);
        process.exit();
      });
  })
}

cron.schedule('30 * * * *',startSync)
function startSync() {
  scrapperFn = Object.values(scrapper);
  scrapperFn.map((fn) => {
    fn.call()
  })
}