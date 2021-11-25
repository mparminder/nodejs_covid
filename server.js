const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config();
let https = require('https')
const fs = require('fs');
const app = express();
require('./sync');

var corsOptions = {
  origin: "*"
};
app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./app/models");
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
// simple route
app.get("/", (req, res) => {
  res.json({ message: "Covid Latest.Online" });
});

require("./app/routes/common")(app);
require("./app/routes/resources")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
if (process.env.SSL_ENABLED==='true') {
  https.createServer({
    key: fs.readFileSync(process.env.SSL_KEY_FILE),
    cert: fs.readFileSync(process.env.SSL_CERT_FILE)
  }, app).listen(PORT, () => {
    console.log(`HTTPS Server running on port ${PORT}`)
  })
} else {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
}
