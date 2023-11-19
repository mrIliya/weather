import axios from './axios'
const KEY = import.meta.env.VITE_WEATHER_API_KEY
export default {
    getCityWeather: async (city) => {
        return axios
            .get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${KEY}&units=metric`)
            .then((res) => res.data)
            .catch((error) => {
                console.log(error)
                return error
            })
    },
    getData: async (lat, lon) => {
        return axios
            .get(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=dayli&appid=${KEY}&units=metric`)
            .then((res) => res.data.hourly)
            .catch((error) => {
                console.log(error)
                return error
            })
    },
    getFiveDays: async (lat, lon) => {
        return axios
            .get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${KEY}&units=metric`)
            .then((res) => res.data)
            .catch((error) => {
                console.log(error)
                return error
            })
    }
}