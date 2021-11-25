const { default: axios } = require("axios")

module.exports = {
get,
}

function get(url) {
    return axios.get(url)
}