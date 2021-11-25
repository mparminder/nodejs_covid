// https://coviddelhi.com/data/coviddelhi.com/bed_data.json?_=44ac16f_20210503114951
const axios = require('./axiosService')
const { checkValidData } = require('../utils');
const moment = require('moment');
const db = require('../../models');
const { mapSite } = require('./mapSite');
const { mongoose } = require('../../models');
function fetchData() {
    axios.get('https://coviddelhi.com/data/coviddelhi.com/bed_data.json?_=44ac16f_20210503114951').then(async (data) => {
        let formattedData = await formatData(data)
        // console.log(formattedData)
        mapSite(formattedData);
        // Start Mapping here
    })

}
async function formatData(data) {
    let final = [];
    const resource = await db.resources.findOne({ name: 'Beds (ICU/Non-ICU)' }).select({ '_id': true }).exec();
    const state = await db.states.findOne({ name: 'Delhi' }).select({ '_id': true }).exec();
    if (data.status == 200) {
        data = data.data;
        data.map(async (elt, i) => {
            let details = { resources: [],state:state._id,city:'Delhi' };
            let otherDetails = {};
            let providerResourceMap = { resource_id: resource._id, active: 1 }
            let resourceOtherDetails = {}
            if (checkValidData(elt.hospital_name)) {
                details.org_name = elt.hospital_name
            }
            if (checkValidData(elt.hospital_address)) {
                details.org_address = elt.hospital_address
            }
            if (checkValidData(elt.hospital_poc_name)) {
                details.poc = elt.hospital_poc_name
            }
            if (checkValidData(elt.available_beds_allocated_to_covid)) {
                providerResourceMap.quantity = elt.available_beds_allocated_to_covid
            }
            if (checkValidData(elt.pincode)) {
                details.pincode = elt.pincode
            }
            if (checkValidData(elt.hospital_category)) {
                otherDetails['Hospital Category'] = elt.hospital_category
            }
            if (checkValidData(elt.hospital_poc_phone)) {
                details.phone = elt.hospital_poc_phone
            }
            if (checkValidData(elt.last_updated_on)) {
                details.last_verified = moment(elt.last_updated_on).format('YYYY-MM-DD hh:mm:ss')
            }
            if (checkValidData(elt.officer_name)) {
                otherDetails['Officer Name'] = elt.officer_name
            }
            if (checkValidData(elt.officer_designation)) {
                otherDetails['Officer Designation'] = elt.officer_designation
            }
            if (checkValidData(elt.hospital_phone)) {
                otherDetails['Other Phones'] = elt.hospital_phone
            }
            if (checkValidData(elt.bed_breakup)) {
                resourceOtherDetails['Bed Breakup'] = elt.bed_breakup ? 'Yes' : 'No'
            }
            if (Object.keys(otherDetails).length > 0) {
                otherDetails['src'] = 'coviddelhi.com'
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