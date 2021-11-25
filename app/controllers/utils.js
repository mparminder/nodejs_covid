const moment = require('moment');
const bcrypt = require('bcrypt');
require('dotenv').config();
module.exports = {
    checkValidData,
    arraySum,
    isvalidDate,
    hashValue,
    compareHashValue
}
let invalidData = ['', '-', undefined]
function checkValidData(data) {
    return !invalidData.includes(data)
}
function arraySum(array) {
    let sum = array.reduce(function (a, b) {
        return a + b;
    }, 0);
    return sum;
}
function isvalidDate(date) {
    let parsedDate = moment(date).format('YYYY-MM-DD')
    if (parsedDate.includes('1970-01-01') || parsedDate.includes('Invalid Date')) {
        return false
    } else {
        return true
    }
}
function hashValue(text, referer = '') {
    return new Promise((resolve, reject) => {
        const saltRounds = referer === 'mapSite' ? process.env.MAP_SITE_SALT_ROUNDS : process.env.BCRYPT_SALT_ROUNDS;
        const salt = bcrypt.genSaltSync(parseInt(saltRounds))
        bcrypt.hash(text, salt, function (err, hash) {
            if (err) reject(err)
            resolve(hash)
        });
    })
}
function compareHashValue(plain, hash) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(plain, hash, function (err, result) {
            if(err) reject(err)
            resolve(result);
        });
    })
}