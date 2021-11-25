module.exports = app => {
    const common = require('../controllers/common.controller');
  
    var router = require("express").Router();
  
    router.get("/states", common.getStates);
  
    router.get("/districts/:state_id", common.getDistrictsByStateId);
  
    app.use("/api/common", router);
  };
  