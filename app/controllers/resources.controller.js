const db = require("../models");

async function getAll(req, res) {
    let total = await db.providers.countDocuments()
    let skip = 0;
    let limit = 10;
    let filterObj = {};
    if (req.query.from && req.query.to) {
        skip = parseInt(req.query.from) - 1;
        limit = parseInt(req.query.to) - parseInt(req.query.from);
    }
    if (req.query.state) {
        if (req.query.state) {
            filterObj.state = req.query.state
        }
    }
    if (req.query.search) {
        filterObj = {
            ...filterObj,
            "$or": [
                { city: { "$regex": req.query.search, '$options': 'i' } },
                { org_address: { "$regex": req.query.search, '$options': 'i' } },
                { org_name: { "$regex": req.query.search, '$options': 'i' } },
            ]
        }
        // if (!isNaN(parseInt(req.query.search))) {
        //     filterObj = { ...filterObj, pincode: { "$regex": (req.query.search) } }
        // }
        limit=50;
    }
    if (req.query.resources) {
        filterObj = { ...filterObj, resources: { '$elemMatch': { resource_id: { '$in': req.query.resources } } } }
    }
    let filteredCount = await db.providers.find({ ...filterObj }).countDocuments()
    let provider = await db.providers.find({ ...filterObj }, { hashValue: false }, { skip, limit }).sort({ pos: -1 }).populate('state').populate('resources.resource_id');
    res.status(200).json({ total: total, filteredRows: filteredCount, data: provider });

}
async function filterByState(custom_id) {
    if (!isNaN(custom_id)) {
        let state = await db.states.findOne({ custom_id }, { _id: true })
        return state ? state._id : false
    } else {
        return false;
    }
}
async function updateUsefulCounters(req, res) {
    const types = ['u', 'n']
    if (!req.body.type) {
        res.status(400).json({ message: 'Please provide an update type!' });
    }
    if (types.includes(req.body.type)) {
        uCount = 0
        nCount = 0
        pCount = 0
        switch (req.body.type) {
            case 'u':
                uCount++;
                pCount++;
                break;
            case 'n':
                nCount--;
                pCount--;
                break
        }
        await db.providers.updateOne({_id:req.params.resource_id}, { '$inc': { usefulCount: uCount, notUseFulCount: nCount, pos: pCount } })
        res.status(200).json({status:200,message:'Updated!'})
    } else {
        res.status(400).json({status:400, message: 'Invalid update type!' });
    }


}
async function addResource(req,res) {
    
}

async function getAllResources(req, res) {
    let filter = {
        active: false,
        createdAt: false,
        updatedAt: false
    }
    let resources = await db.resources.find({active: 1},filter)
    res.status(200).json({data:resources})
}

module.exports = {
    getAll,
    updateUsefulCounters,
    addResource,
    getAllResources
}