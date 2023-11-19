import axios from './axios'
const KEY = import.meta.env.VITE_LOCATION_API_KEY

export default {
    getUserIP: async () => {
        return axios
            .get('https://api.ipify.org?format=json')
            .then((res) => res.data.ip)
            .catch((error) => {
                console.log(error)
                return error
            })
    },
    getUserLocation: async (ipAdress) => {
        return axios
            .get(`https://geo.ipify.org/api/v2/country,city?apiKey=${KEY}=${ipAdress}`)
            .then((res) => res.data.location)
            .catch((error) => {
                console.log(error)
                return error
            })
    },
}
