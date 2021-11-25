const { Seeder } = require('mongoose-data-seed');
const db = require('../models/index');
const data=[
    {
        name:'Oxygen',
        active:1
    },
    {
        name:'Beds (ICU/Non-ICU)',
        active:1
    },
    {
        name:'Plasma',
        active:1
    },
    {
        name:'Remdesivir',
        active:1
    },
    {
        name:'ICU Beds',
        active:1
    }
]
class ResourcesSeeder extends Seeder {

    async shouldRun() {
        return db.resources.countDocuments().exec().then(count => count === 0);
    }

    async run() {
        console.log('Started seeding resources.js')
        return db.resources.create(data).then(()=>{
            console.log('Completed seeding resources.js')
        })
    }
}

module.exports = ResourcesSeeder;