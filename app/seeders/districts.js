const { default: axios } = require('axios');
const { Seeder } = require('mongoose-data-seed');
const db = require('../models/index');
class DistrictSeeder extends Seeder {

    callApi() {
        return new Promise((resolve, reject) => {
            db.states.find({}, { custom_id: true }, (err, states) => {
                states.forEach(state => {
                    const api = axios.get('https://cdn-api.co-vin.in/api/v2/admin/location/districts/' + state.custom_id, { headers: { 'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36' } })
                    api.then((response) => {
                        let temp=[];
                        response.data.districts.forEach((district) => {
                           temp.push({
                                name: district.district_name,
                                custom_id: district.district_id,
                                active: 1,
                                state_custom_id: state.custom_id
                            })
                            this.insertIntoDb(temp)
                            temp=[];
                        })
                    }).catch(err => {
                        reject(err)
                    })
                });
                resolve(true);
            })

        })
    }
    insertIntoDb(data){
        db.districts.create(data)
    }
    async shouldRun() {
        return db.districts.countDocuments().exec().then(count => count === 0);
    }

    async run() {
        console.log('Started seeding district.js');
        this.callApi().then((()=>{
            console.log('Completed seeding district.js');
        }))


    }
}

module.exports = DistrictSeeder;