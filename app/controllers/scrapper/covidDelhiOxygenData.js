// https://coviddelhi.com/data/coviddelhi.com/bed_data.json?_=44ac16f_20210503114951
const axios = require('./axiosService')
const { checkValidData, arraySum, isvalidDate } = require('../utils');
const moment = require('moment');
const db = require('../../models');
const { mapSite } = require('./mapSite');
function fetchData() {
    axios.get('https://coviddelhi.com/data/coviddelhi.com/oxygen_data.json?_=44ac16f_20210503114951').then(async (data) => {
        let formattedData = await formatData(data)
        mapSite(formattedData);
        // console.log(formattedData)
    })

}
async function formatData(data) {
    let final = [];
    const resource = await db.resources.findOne({ name: 'Oxygen' }).select({ '_id': true }).exec();
    const state = await db.states.findOne({ name: 'Delhi' }).select({ '_id': true }).exec();
    if (data.status == 200) {
        data = data.data;
        data.map(async (elt, i) => {
            let details = { resources: [], state: state._id, city: 'Delhi' };
            let otherDetails = {};
            let providerResourceMap = { resource_id: resource._id, active: 1 }
            let resourceOtherDetails = {}
            if (checkValidData(elt.name)) {
                details.org_name = elt.name
            }
            else{
               details.org_name = 'Unknown Vendor';
            }
            if (checkValidData(elt.area)) {
                details.org_address = elt.area+' '+elt.city
            }
            if (checkValidData(elt.hospital_category)) {
                otherDetails['Hospital Category'] = elt.hospital_category
            }
            if (checkValidData(elt.phone)) {
                details.phone = elt.phone
            }
            if (checkValidData(elt.last_verified_on) && isvalidDate(elt.last_verified_on)) {
                details.last_verified = moment().utc(elt.last_updated_on).local().format('YYYY-MM-DD hh:mm:ss')
            }
            if (checkValidData(elt.refill_available)) {
                resourceOtherDetails['Refill Available?'] = elt.refill_available?'Yes':'No';
            }
            if (checkValidData(elt.can_available)) {
                resourceOtherDetails['Can Available?'] = elt.can_available?'Yes':'No';
            }
            if (checkValidData(elt.cylinder_available)) {
                resourceOtherDetails['Cylinder Available?'] = elt.cylinder_available?'Yes':'No';
            }
            if (checkValidData(elt.verified)) {
                resourceOtherDetails['Verified?'] = elt.verified?'Yes':'No';
            }
            if (checkValidData(elt.notes)) {
                resourceOtherDetails['Notes'] = elt.notes;
            }
            if (Object.keys(otherDetails).length > 0) {
                otherDetails['Source'] = 'coviddelhi.com'
                details.other_details = JSON.stringify(otherDetails)
            }
            if (Object.keys(resourceOtherDetails).length > 0) {
                providerResourceMap.other_details = JSON.stringify(resourceOtherDetails)
            }
            if (Object.keys(providerResourceMap).length > 0) {
                details.resources.push(providerResourceMap);
            }
            if (Object.keys(details).length > 0) {
                final.push(details)
            }
        })
        return final
    }
}

module.exports = fetchData
