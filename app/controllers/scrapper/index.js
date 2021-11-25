covidDelhiBed = require('./covidDelhiBedData');
covidDelhiPlasma = require('./covidDelhiPlasmaData')
covidDelhiOxygen = require('./covidDelhiOxygenData')
const scrapper = {
    covidDelhiBed,
    covidDelhiPlasma,
    covidDelhiOxygen
}
module.exports=scrapper