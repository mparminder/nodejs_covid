const { default: axios } = require('axios');
const { Seeder } = require('mongoose-data-seed');
const db = require('../models/index');

let data = [];
class StatesSeeder extends Seeder {
    callApi() {
        return new Promise((resolve, reject) => {
            const api = axios.get('https://cdn-api.co-vin.in/api/v2/admin/location/states', { headers: { 'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36' } });
            api.then((response) => {
                response.data.states.forEach(elt => {
                    data.push({
                        custom_id: elt.state_id,
                        name: elt.state_name,
                        active: 1
                    });
                });
                resolve(data);
            }).catch(err => {
                reject(false);
            })
        })
    }
    async shouldRun() {
        return db.states.countDocuments().exec().then(count => count === 0);
    }

    async run() {
        console.log('Started seeding states.js');
        this.callApi().then((data) => {
            db.states.create(data).then(()=>{
                console.log('Completed seeding states.js');
            })
        });

    }
}

module.exports = StatesSeeder;