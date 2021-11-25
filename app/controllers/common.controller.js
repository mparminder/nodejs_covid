const db = require("../models");

function getStates(req,res) {
    db.states.find({active:1},{active:false},(err,states)=>{
        res.status(200).json(states);
    })
}
function getDistrictsByStateId(req,res) {
    if(!isNaN(req.params.state_id)){
        db.districts.find({state_custom_id:req.params.state_id},{active:false,_id:false},(err,districts)=>{
            res.status(200).json(districts);
        })
    }else{
        res.status(400).json({message:'Please specify a numeric state ID'});
    }
}
module.exports = {
    getStates,
    getDistrictsByStateId,
}