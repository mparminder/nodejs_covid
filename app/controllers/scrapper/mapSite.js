const e = require('express');
const { hashValue, compareHashValue } = require('../../controllers/utils');
const db = require('../../models');
let insertRecords;
let updateRecords;
module.exports = {
    mapSite,
}
async function mapSite(dataArr, src) {
    insertRecords = [];
    updateRecords = [];
    let existingHashes = await getExistingHashes(src);
    iterateAndArrangeRecords(dataArr, existingHashes).then(async () => {
        if (updateRecords.length > 0) {
            await updateRecordsInMongo()
        }
        if (insertRecords.length > 0) {
            await insertDataInMongo();
        }
        console.log("Process Completed")
    })
}
function getExistingHashes(src) {
    return new Promise((resolve, reject) => {
        db.providers.find({ src: src }).select({ hashValue: true, _id: false }).exec((err, data) => {
            if (err) reject(err)
            let hashes = [];
            data.forEach(elt => {
                hashes.push(elt.hashValue)
            });
            resolve(hashes)
        });
    })
}

function iterateAndArrangeRecords(dataArr, existingHashes) {
    return new Promise(async (resolve, reject) => {
        for (elt of dataArr) {
            const hash = '##--'+elt.org_name.toLowerCase().replace('/\s/g', '&') + elt.pincode + elt.phone;
            let doesExist = existingHashes.includes(hash);
            if (doesExist) {
                elt.hashValue = hash;
                await updateRecordsArray('update', elt);
            } else {
                elt.hashValue = hash
                await updateRecordsArray('insert', elt);
            }
        }
        resolve(true)
    })
}
function updateRecordsArray(type, elt) {
    return new Promise(async (resolve, reject) => {
        if (type == 'update') {
            await db.providers.updateOne({ hashValue: elt.hashValue }, { "$set": { ...elt } }, { upsert: true })
            resolve(true)

        } else if (type == 'insert') {
            insertRecords.push(elt)
            resolve(true)
        }
        else {
            reject(false)
        }
    })
}
function insertDataInMongo() {
    return new Promise((resolve, reject) => {
        db.providers.insertMany(insertRecords, (err, success) => {
            if (err) reject(err)
            resolve(true);
        })
    })
}

function compareMultipleHashes(plain, existingHashes) {
    return new Promise(async (resolve, reject) => {
        for (hash of existingHashes) {
            if (hash) {
                await compareHashValue(plain, hash).then(async (result) => {
                    if (result) {
                        resolve(hash)
                    }
                })
            }
        }
        resolve(false);
    })
}