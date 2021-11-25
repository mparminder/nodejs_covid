// https://coviddelhi.com/data/coviddelhi.com/bed_data.json?_=44ac16f_20210503114951
const axios = require('./axiosService')
const { checkValidData, arraySum, isvalidDate } = require('../utils');
const moment = require('moment');
const db = require('../../models');
const { mapSite } = require('./mapSite');
function fetchData() {
    axios.get('https://coviddelhi.com/data/coviddelhi.com/plasma_data.json?_=44ac16f_20210503114951').then(async (data) => {
        let formattedData = await formatData(data)
        mapSite(formattedData)
    })

}
async function formatData(data) {
    let final = [];
    const resource = await db.resources.findOne({ name: 'Plasma' }).select({ '_id': true }).exec();
    const state = await db.states.findOne({ name: 'Delhi' }).select({ '_id': true }).exec();
    if (data.status == 200) {
        data = data.data;
        data.map(async (elt, i) => {
            let details = { resources: [], state: state._id, city: 'Delhi' };
            let otherDetails = {};
            let providerResourceMap = { resource_id: resource._id, active: 1 }
            let resourceOtherDetails = {}
            let quantityArr=[];
            if (checkValidData(elt.name)) {
                details.org_name = elt.name
            }
            else{
               return;
            }
            if (checkValidData(elt.address)) {
                details.org_address = elt.address
            }
            if (checkValidData(elt.hospital_poc_name)) {
                details.poc = elt.hospital_poc_name
            }
            if (checkValidData(elt.availability)) {
                providerResourceMap.quantity = arraySum(Object.values(elt.availability))
                Object.keys(elt.availability).map(k=>{
                    quantityArr.push(k+': '+elt.availability[k]);
                })
            }
            if (checkValidData(elt.pincode)) {
                details.pincode = elt.pincode
            }
            if (checkValidData(elt.hospital_category)) {
                otherDetails['Hospital Category'] = elt.hospital_category
            }
            if (checkValidData(elt.phone)) {
                let otherPhones = elt.phone.split(',')
                details.phone = otherPhones[0]
                checkValidData(otherPhones[1]) ? otherDetails['Other Phones'] = otherPhones.join(',').replace(details.phone, '').replace(',', '') : ''
            }
            if (checkValidData(elt.email)) {
                details.email = elt.email
            }
            if (checkValidData(elt.fax)) {
                details.fax = elt.fax
            }
            if (checkValidData(elt.last_updated_on) && isvalidDate(elt.last_updated_on)) {
                details.last_verified = moment(elt.last_updated_on).format('YYYY-MM-DD hh:mm:ss')
            }
            if (checkValidData(elt.org_type)) {
                otherDetails['Organization Type'] = elt.org_type
            }
            if (checkValidData(elt.status)) {
                resourceOtherDetails['Availability Status'] = elt.status.replace('_', ' ').toLocaleUpperCase()
                elt.status == 'not_available' ? providerResourceMap.quantity = 0 : '';
            }
            if(quantityArr.length>0){
                resourceOtherDetails['Notes'] = quantityArr.join(' \n ');
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
