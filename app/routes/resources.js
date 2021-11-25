module.exports = app => {
    const resources = require('../controllers/resources.controller');
  
    var router = require("express").Router();
  
    router.get("/all", resources.getAll);
    router.get("/allResources", resources.getAllResources)
  
    router.put("/updatecounts/:resource_id", resources.updateUsefulCounters);
    router.post("/add", resources.addResource)
  
    app.use("/api/resources", router);
  };
  